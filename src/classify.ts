import { getArgValues, getMode, parseReading } from './clis';
import type {
	Averages,
	BloodPressureCategory,
	ClassificationMode,
	MillimetresOfMercuryReading,
	PulseCategory,
	Threshold,
} from './model';

const CLINIC_THRESHOLDS = [
	{ category: 'Severe', systolic: 180, diastolic: 110 },
	{ category: 'Stage 2 hypertension', systolic: 160, diastolic: 100 },
	{ category: 'High (stage 1 hypertension)', systolic: 140, diastolic: 90 },
	{ category: 'High Normal', systolic: 121, diastolic: 81 },
] as const satisfies readonly Threshold[];

const HOME_THRESHOLDS = [
	{ category: 'Severe', systolic: 180, diastolic: 110 },
	{ category: 'Stage 2 hypertension', systolic: 150, diastolic: 95 },
	{ category: 'High (stage 1 hypertension)', systolic: 135, diastolic: 85 },
	{ category: 'High Normal', systolic: 121, diastolic: 81 },
] as const satisfies readonly Threshold[];

export const classifyMillimetresOfMercury = (
	{ systolic, diastolic }: MillimetresOfMercuryReading,
	mode: ClassificationMode = 'home',
): BloodPressureCategory => {
	const thresholds = mode === 'clinic' ? CLINIC_THRESHOLDS : HOME_THRESHOLDS;
	const match = thresholds.find(
		(t) => systolic >= t.systolic || diastolic >= t.diastolic,
	);

	if (match) return match.category;

	return systolic < 90 || diastolic < 60 ? 'Low' : 'Ideal';
};

export const classifyPulse = (pulse: number): PulseCategory => {
	if (pulse < 60) return 'Bradycardia (slow)';
	if (pulse <= 100) return 'Normal';
	return 'Tachycardia (fast)';
};

export const getClassifications = (
	mode: ClassificationMode,
	averages: Averages,
) => {
	const mmhg = classifyMillimetresOfMercury(
		{ systolic: averages.systolic, diastolic: averages.diastolic },
		mode,
	);
	const pulseCategory = classifyPulse(averages.pulse);

	return { mmhg, pulseCategory };
};

const main = () => {
	const values = getArgValues();
	const { systolic, diastolic, pulse } = parseReading(values);
	const mode = getMode(values);
	const { mmhg, pulseCategory } = getClassifications(mode, {
		systolic: systolic,
		diastolic: diastolic,
		pulse: pulse,
	});

	console.log(`mmHg: ${mmhg}, pulse: ${pulseCategory}`);
};

if (import.meta.main) {
	main();
}
