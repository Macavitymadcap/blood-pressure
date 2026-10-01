import { BloodPressureRepository } from './db';
import type { BloodPressureReading } from './model';

const getAverage = (
	readings: BloodPressureReading[],
	key: keyof Omit<BloodPressureReading, 'timestamp'>,
) => {
	const sum = readings.reduce((total, reading) => total + reading[key], 0);
	const rawAverage = sum / readings.length;
	return Math.round(rawAverage);
};

export const getAverages = (readings: BloodPressureReading[]) => {
	return {
		systolic: getAverage(readings, 'systolic'),
		diastolic: getAverage(readings, 'diastolic'),
		pulse: getAverage(readings, 'pulse'),
	};
};

const main = () => {
	using db = new BloodPressureRepository();
	const readings = db.readAll();
	const count = readings.length;
	if (count === 0) {
		console.log('No readings found in the database.');
		process.exit(0);
	}
	const first = new Date(
		(readings[0] as Required<BloodPressureReading>).timestamp,
	);
	const last = new Date(
		(readings[readings.length - 1] as Required<BloodPressureReading>).timestamp,
	);

	const { systolic, diastolic, pulse } = getAverages(readings);

	console.log(
		`Average reading: ${systolic}/${diastolic} mmHg, Pulse: ${pulse} bpm`,
	);
	console.log(
		`Total readings: ${count} from ${first.toLocaleString()} to ${last.toLocaleString()}`,
	);
};

if (import.meta.main) {
	main();
}
