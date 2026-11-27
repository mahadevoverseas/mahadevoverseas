/**
 * Eligibility checker scoring: adds up the weights for each answer and returns
 * the 2–3 best-fit countries. Guidance only — never a guarantee.
 */
export function suggestCountries(answers, countries, eligibility) {
  const score = Object.fromEntries(countries.map((c) => [c.id, 0]));
  for (const [q, value] of Object.entries(answers)) {
    const table = eligibility.weights[q]?.[value] ?? {};
    for (const [id, pts] of Object.entries(table)) if (id in score) score[id] += pts;
  }
  return countries
    .map((c) => ({ ...c, score: score[c.id] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((c, i) => i < 2 || c.score > 0);
}
