import { Database, type Statement } from 'bun:sqlite';
import { join } from 'node:path';
import { getArgValues, parseReading } from './clis';
import type { BloodPressureReading } from './model';

export const DEFAULT_DB_PATH = join(import.meta.dir, '..', 'blood-pressure.db');

export class BloodPressureRepository implements Disposable {
	#db: Database;
	#insert: Statement;
	#disposed = false;

	constructor(path = DEFAULT_DB_PATH) {
		this.#db = new Database(path, { create: true, strict: true });
		this.#insert = this.#db.prepare(
			'INSERT INTO readings (systolic, diastolic, pulse, timestamp) VALUES (?, ?, ?, ?)',
		);
		this.#createTable();
	}

	#createTable() {
		this.#db.run(`
      CREATE TABLE IF NOT EXISTS readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        systolic INTEGER NOT NULL,
        diastolic INTEGER NOT NULL,
        pulse INTEGER NOT NULL,
        timestamp TEXT NOT NULL
      )
    `);
	}

	create(reading: BloodPressureReading) {
		const timestamp = reading.timestamp || new Date().toISOString();
		const result = this.#insert.run(
			reading.systolic,
			reading.diastolic,
			reading.pulse,
			timestamp,
		);

		return result.lastInsertRowid as number;
	}

	read(id: number): Required<BloodPressureReading> | null {
		const row = this.#db
			.query(
				`SELECT systolic, diastolic, pulse, timestamp FROM readings WHERE id = ?`,
			)
			.get(id) as Required<BloodPressureReading> | undefined;

		return row || null;
	}

	readAll(): Required<BloodPressureReading>[] {
		const rows = this.#db.query(
			'SELECT systolic, diastolic, pulse, timestamp FROM readings',
		);
		const all = rows.all() as Required<BloodPressureReading>[];
		const sorted = all.toSorted(
			(a, b) =>
				new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
		);

		return sorted;
	}

	[Symbol.dispose]() {
		if (this.#disposed) return;
		this.#disposed = true;
		this.#insert.finalize();
		this.#db.close();
	}
}

const main = () => {
	const values = getArgValues();
	const newReading = parseReading(values);
	using db = new BloodPressureRepository();
	const id = db.create(newReading);
	const { systolic, diastolic, pulse, timestamp } = db.read(
		id,
	) as Required<BloodPressureReading>;

	console.log(`Inserted reading with ID ${id}:`);
	console.log(
		`Systolic: ${systolic}, Diastolic: ${diastolic}, Pulse: ${pulse}, Timestamp: ${timestamp}`,
	);
};

if (import.meta.main) {
	main();
}
