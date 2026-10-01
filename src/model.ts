import type { getAverages } from './averages';

export type BloodPressureReading = {
	systolic: number;
	diastolic: number;
	pulse: number;
	timestamp?: string;
};

export type MillimetresOfMercuryReading = Omit<BloodPressureReading, 'pulse'>;

export type BloodPressureCategory =
	| 'Low'
	| 'Ideal'
	| 'High Normal'
	| 'High (stage 1 hypertension)'
	| 'Stage 2 hypertension'
	| 'Severe';

export type Threshold = {
	category: BloodPressureCategory;
} & MillimetresOfMercuryReading;

export type PulseCategory =
	| 'Bradycardia (slow)'
	| 'Normal'
	| 'Tachycardia (fast)';

export type ClassificationMode = 'home' | 'clinic';

export type ArgValues = {
	systolic?: string | undefined;
	diastolic?: string | undefined;
	pulse?: string | undefined;
	mode?: string | undefined;
};

export type Averages = ReturnType<typeof getAverages>;
