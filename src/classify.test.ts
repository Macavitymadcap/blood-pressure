import { describe, expect, test } from 'bun:test';
import { classifyMillimetresOfMercury } from './classify';
import type {
	BloodPressureCategory,
	ClassificationMode,
	MillimetresOfMercuryReading,
} from './model';

type TestCase = {
	reading: MillimetresOfMercuryReading;
	mode: ClassificationMode;
	expected: BloodPressureCategory;
};

describe('classify', () => {
	const testCases: TestCase[] = [
		// Home: Low
		{ reading: { systolic: 89, diastolic: 70 }, mode: 'home', expected: 'Low' },
		{
			reading: { systolic: 110, diastolic: 59 },
			mode: 'home',
			expected: 'Low',
		},
		{ reading: { systolic: 89, diastolic: 59 }, mode: 'home', expected: 'Low' },

		// Home: Ideal
		{
			reading: { systolic: 90, diastolic: 60 },
			mode: 'home',
			expected: 'Ideal',
		},
		{
			reading: { systolic: 112, diastolic: 74 },
			mode: 'home',
			expected: 'Ideal',
		},
		{
			reading: { systolic: 120, diastolic: 80 },
			mode: 'home',
			expected: 'Ideal',
		},

		// Home: High Normal
		{
			reading: { systolic: 121, diastolic: 80 },
			mode: 'home',
			expected: 'High Normal',
		},
		{
			reading: { systolic: 120, diastolic: 81 },
			mode: 'home',
			expected: 'High Normal',
		},
		{
			reading: { systolic: 134, diastolic: 84 },
			mode: 'home',
			expected: 'High Normal',
		},

		// Home: Stage 1
		{
			reading: { systolic: 135, diastolic: 70 },
			mode: 'home',
			expected: 'High (stage 1 hypertension)',
		},
		{
			reading: { systolic: 120, diastolic: 85 },
			mode: 'home',
			expected: 'High (stage 1 hypertension)',
		},
		{
			reading: { systolic: 149, diastolic: 94 },
			mode: 'home',
			expected: 'High (stage 1 hypertension)',
		},

		// Home: Stage 2
		{
			reading: { systolic: 150, diastolic: 94 },
			mode: 'home',
			expected: 'Stage 2 hypertension',
		},
		{
			reading: { systolic: 140, diastolic: 95 },
			mode: 'home',
			expected: 'Stage 2 hypertension',
		},
		{
			reading: { systolic: 179, diastolic: 109 },
			mode: 'home',
			expected: 'Stage 2 hypertension',
		},

		// Home: Severe
		{
			reading: { systolic: 180, diastolic: 90 },
			mode: 'home',
			expected: 'Severe',
		},
		{
			reading: { systolic: 150, diastolic: 110 },
			mode: 'home',
			expected: 'Severe',
		},
		{
			reading: { systolic: 220, diastolic: 130 },
			mode: 'home',
			expected: 'Severe',
		},

		// Clinic: Low and Ideal (same floors as home)
		{
			reading: { systolic: 89, diastolic: 70 },
			mode: 'clinic',
			expected: 'Low',
		},
		{
			reading: { systolic: 90, diastolic: 60 },
			mode: 'clinic',
			expected: 'Ideal',
		},
		{
			reading: { systolic: 120, diastolic: 80 },
			mode: 'clinic',
			expected: 'Ideal',
		},

		// Clinic: High Normal
		{
			reading: { systolic: 121, diastolic: 80 },
			mode: 'clinic',
			expected: 'High Normal',
		},
		{
			reading: { systolic: 120, diastolic: 81 },
			mode: 'clinic',
			expected: 'High Normal',
		},
		{
			reading: { systolic: 139, diastolic: 89 },
			mode: 'clinic',
			expected: 'High Normal',
		},

		// Clinic: Stage 1
		{
			reading: { systolic: 140, diastolic: 80 },
			mode: 'clinic',
			expected: 'High (stage 1 hypertension)',
		},
		{
			reading: { systolic: 130, diastolic: 90 },
			mode: 'clinic',
			expected: 'High (stage 1 hypertension)',
		},
		{
			reading: { systolic: 159, diastolic: 99 },
			mode: 'clinic',
			expected: 'High (stage 1 hypertension)',
		},

		// Clinic: Stage 2
		{
			reading: { systolic: 160, diastolic: 90 },
			mode: 'clinic',
			expected: 'Stage 2 hypertension',
		},
		{
			reading: { systolic: 150, diastolic: 100 },
			mode: 'clinic',
			expected: 'Stage 2 hypertension',
		},
		{
			reading: { systolic: 179, diastolic: 109 },
			mode: 'clinic',
			expected: 'Stage 2 hypertension',
		},

		// Clinic: Severe
		{
			reading: { systolic: 180, diastolic: 100 },
			mode: 'clinic',
			expected: 'Severe',
		},
		{
			reading: { systolic: 150, diastolic: 110 },
			mode: 'clinic',
			expected: 'Severe',
		},

		// Same reading, different mode
		{
			reading: { systolic: 137, diastolic: 80 },
			mode: 'home',
			expected: 'High (stage 1 hypertension)',
		},
		{
			reading: { systolic: 137, diastolic: 80 },
			mode: 'clinic',
			expected: 'High Normal',
		},
		{
			reading: { systolic: 150, diastolic: 94 },
			mode: 'clinic',
			expected: 'High (stage 1 hypertension)',
		},

		// Mixed low/high: high takes precedence (documents current behaviour)
		{
			reading: { systolic: 85, diastolic: 82 },
			mode: 'home',
			expected: 'High Normal',
		},
	];

	testCases.forEach((testCase) => {
		test(`classifies ${JSON.stringify(testCase.reading)} in ${testCase.mode} mode as ${testCase.expected}`, () => {
			// Arrange
			const { reading, mode, expected } = testCase;

			// Act
			const result = classifyMillimetresOfMercury(reading, mode);

			// Assert
			expect(result).toBe(expected);
		});
	});
});
