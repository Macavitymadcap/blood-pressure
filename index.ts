import { getAverages } from './src/averages';
import { getClassifications } from './src/classify';
import { getArgValues, getMode, parseReading } from './src/clis';
import { BloodPressureRepository } from './src/db';

const main = () => {
	const values = getArgValues();
	const mode = getMode(values);
	const newReading = parseReading(values);
	using db = new BloodPressureRepository();
	db.create(newReading);
	const readings = db.readAll();

	const {
		systolic: averageSystolic,
		diastolic: averageDiastolic,
		pulse: averagePulse,
	} = getAverages(readings);

	console.log(
		`Average reading: ${averageSystolic}/${averageDiastolic} mmHg, Pulse: ${averagePulse} bpm`,
	);

	const { mmhg, pulseCategory } = getClassifications(mode, {
		systolic: averageSystolic,
		diastolic: averageDiastolic,
		pulse: averagePulse,
	});

	console.log(`mmHg: ${mmhg}, pulse: ${pulseCategory}`);
};

if (import.meta.main) {
	main();
}
