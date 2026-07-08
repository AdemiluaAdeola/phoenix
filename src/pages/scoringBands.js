// Scoring bands for the Clarity assessment, per Veta's spec:
//   Rebuilding:     25–65
//   Transitioning:  66–85
//   Awakening:      86–105
//   Rising:         106–125
//
// IMPORTANT: this is a RAW TOTAL of the 25 questions (each answered 1-5),
// not the 0-100 percentage that's stored in `score`. The raw total is
// derived here from the saved `answers` array.
//
// NOTE FOR VETA: The `narrative` strings below are PLACEHOLDERS. They are
// intentionally obvious/awkward so nobody mistakes them for final copy.
// Replace each one with your actual band narrative before this goes live
// with real clients viewing full reports.

export const getRawTotal = (answers) => {
  if (!Array.isArray(answers)) return null;
  return answers.reduce((sum, val) => sum + (Number(val) || 0), 0);
};

export const scoringBands = [
  {
    key: 'rebuilding',
    label: 'Rebuilding',
    min: 25,
    max: 65,
    narrative: `⚠️ PLACEHOLDER COPY — replace with the real "Rebuilding" band narrative. This text is shown to the coach in the dashboard for participants scoring 25–65.`,
  },
  {
    key: 'transitioning',
    label: 'Transitioning',
    min: 66,
    max: 85,
    narrative: `⚠️ PLACEHOLDER COPY — replace with the real "Transitioning" band narrative. This text is shown to the coach in the dashboard for participants scoring 66–85.`,
  },
  {
    key: 'awakening',
    label: 'Awakening',
    min: 86,
    max: 105,
    narrative: `⚠️ PLACEHOLDER COPY — replace with the real "Awakening" band narrative. This text is shown to the coach in the dashboard for participants scoring 86–105.`,
  },
  {
    key: 'rising',
    label: 'Rising',
    min: 106,
    max: 125,
    narrative: `⚠️ PLACEHOLDER COPY — replace with the real "Rising" band narrative. This text is shown to the coach in the dashboard for participants scoring 106–125.`,
  },
];

export const getScoringBand = (rawTotal) => {
  if (rawTotal === null || rawTotal === undefined) return null;
  return scoringBands.find((b) => rawTotal >= b.min && rawTotal <= b.max) || null;
};