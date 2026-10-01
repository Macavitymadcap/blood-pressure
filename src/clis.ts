import { parseArgs } from 'node:util';
import type {
	ArgValues,
	BloodPressureReading,
	ClassificationMode,
} from './model';

export const getArgValues = (): ArgValues => {
	const { values } = parseArgs({
		args: Bun.argv,
		options: {
			systolic: {
				short: 's',
				type: 'string',
			},
			diastolic: {
				short: 'd',
				type: 'string',
			},
			pulse: {
				short: 'p',
				type: 'string',
			},
			mode: {
				short: 'm',
				type: 'string',
				optional: true,
			},
		},
		strict: true,
		allowPositionals: true,
	});

	return values;
};

export const parseReading = (values: ArgValues): BloodPressureReading => {
	if (!values.systolic || !values.diastolic || !values.pulse) {
		console.error(
			'Missing arguments: systolic, diastolic, and pulse are required.',
		);
		process.exit(1);
	}

	const systolic = Number.parseInt(values.systolic, 10);
	const diastolic = Number.parseInt(values.diastolic, 10);
	const pulse = Number.parseInt(values.pulse, 10);

	if (
		Number.isNaN(systolic) ||
		Number.isNaN(diastolic) ||
		Number.isNaN(pulse)
	) {
		console.error(
			'Invalid input: systolic, diastolic, and pulse must be numbers.',
		);
		process.exit(1);
	}

	return {
		systolic,
		diastolic,
		pulse,
		timestamp: new Date().toISOString(),
	};
};

export const getMode = (values: ArgValues): ClassificationMode => {
	const mode = values.mode === 'clinic' ? 'clinic' : 'home';

	return mode;
};
