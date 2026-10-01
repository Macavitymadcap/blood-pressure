# blood-pressure

A CLI tool for recording blood pressure readings, getting the current average,
and classifying it based on current NICE/NHS guidelines.

## Setup

To install dependencies:

```bash
bun install
```

## Scripts

To add a reading to the database, get all get the average after adding and
classify it, run:

```bash
bun all -s <SYSTOLIC> -d <DIASTOLIC> -p <PULSE> -m <home | clinic>
```

where:

- `-s`/`--systolic` | `Number` (required): The pressure in your arteries when
  your heart beats and pumps blood out. Normal is under 120 mm Hg
- `-d`/`--diastolic` | `Number` (required): The pressure in your arteries when
  your heart rests between beats. Normal is under 80 mm Hg
- `-p`/`--pulse` | `Number` (required): Number of beats per minute
- `-m`/`--mode` | `'home'/'clinic'` (optional): whether to classify the reading
  based on the home or clinical scale (see [bands](#nhsnice-bands) below)

If you only want to add a reading, run:

```bash
bun add -s <SYSTOLIC> -d <DIASTOLIC> -p <PULSE>
```

If you want to classify a reading without adding it to the database, run:

```bash
bun classify -s <SYSTOLIC> -d <DIASTOLIC> -p <PULSE> -m <home | clinic>
```

To get the current averages with some database statistics run:

```bash
bun averages
```

## NHS/NICE Bands

The NHS/NICE bands for adults under 80, as measured by a healthcare
professional, with the home equivalents where they differ:

| Category | Clinic reading | Home average |
| -------- | -------------- | ------------ |
| Low | Below 90/60 | Below 90/60 |
| Ideal | 90/60 to 120/80 | 90/60 to 120/80 |
| High normal (pre-high) | 120/80 to 139/89 | 120/80 to 134/84 |
| High (stage 1 hypertension) | 140/90 or higher | 135/85 or higher |
| Stage 2 hypertension | 160/100 or higher | 150/95 or higher |
| Severe; contact NHS 111 or GP urgently | 180/110 or higher | 180/110 or higher |

And for pulse:

| Category | Resting heart rate |
| -------- | ------------------ |
| Low (bradycardia) | Below 60 bpm; often normal if you're very fit |
| Normal | 60 to 100 bpm |
| High (tachycardia) | Above 100 bpm |

A few notes on reading these:

- Either number crossing a threshold is enough to put you in that band. For
  example, 135/92 counts as high because the diastolic is over 90, even
  though the systolic isn't over 140.
- Home thresholds are lower because readings taken at home tend to be lower
  than those taken in a clinic (the "white coat" effect works in reverse).
- Low blood pressure is usually only a concern if it causes symptoms such as
  dizziness or fainting.
- For people aged 80 or over, the high threshold rises to 150/90 in clinic and
  145/85 at home.
