// Scoring bands for the Clarity assessment — this REPLACES the old
// 3-archetype system (Phoenix Momentum / Dreaming / Awakening, which was
// derived from the 5 dimension scores). Bands are now the single source of
// truth for classifying a result, driven by the raw total score (25-125),
// per Veta's spec:
//   Rebuilding:     25–65
//   Transitioning:  66–85
//   Awakening:      86–105
//   Rising:         106–125
//
// NOTE FOR VETA: `intro` and `directRead` below are PLACEHOLDERS, deliberately
// obvious so nobody mistakes them for final copy. Replace each with your real
// band narrative before this goes live for clients viewing full reports —
// this is now the ONLY narrative shown on the results page, in the email,
// and in the dashboard, so it needs your actual copy.

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
    intro: `⚠️ PLACEHOLDER — short intro copy for the "Rebuilding" band (25–65). Shown on the results page hero and in the results email.`,
    directRead: `⚠️ PLACEHOLDER — Veta's direct-read narrative for the "Rebuilding" band (25–65). Shown on the results page, in the email, and in the dashboard detail view.`,
  },
  {
    key: 'transitioning',
    label: 'Transitioning',
    min: 66,
    max: 85,
    intro: `⚠️ PLACEHOLDER — short intro copy for the "Transitioning" band (66–85). Shown on the results page hero and in the results email.`,
    directRead: `⚠️ PLACEHOLDER — Veta's direct-read narrative for the "Transitioning" band (66–85). Shown on the results page, in the email, and in the dashboard detail view.`,
  },
  {
    key: 'awakening',
    label: 'Awakening',
    min: 86,
    max: 105,
    intro: `⚠️ PLACEHOLDER — short intro copy for the "Awakening" band (86–105). Shown on the results page hero and in the results email.`,
    directRead: `⚠️ PLACEHOLDER — Veta's direct-read narrative for the "Awakening" band (86–105). Shown on the results page, in the email, and in the dashboard detail view.`,
  },
  {
    key: 'rising',
    label: 'Rising',
    min: 106,
    max: 125,
    intro: `⚠️ PLACEHOLDER — short intro copy for the "Rising" band (106–125). Shown on the results page hero and in the results email.`,
    directRead: `⚠️ PLACEHOLDER — Veta's direct-read narrative for the "Rising" band (106–125). Shown on the results page, in the email, and in the dashboard detail view.`,
  },
];

export const getScoringBand = (rawTotal) => {
  if (rawTotal === null || rawTotal === undefined) return null;
  return scoringBands.find((b) => rawTotal >= b.min && rawTotal <= b.max) || null;
};

export const getScoringBandByKey = (key) => scoringBands.find((b) => b.key === key) || null;
