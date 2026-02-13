const insightRules = {
  clubbing: 'Possible association: cardiac or respiratory disorders. Recommend physician evaluation.',
  pitting: 'Possible association: psoriasis or autoimmune nail changes.',
  'blue finger': 'Possible association: circulation or oxygenation issues.',
  onychomycosis: 'Likely fungal infection. Consider confirmatory dermatology testing.',
  'brittle nails': 'Possible association: nutritional deficiency, thyroid imbalance, or dehydration.',
};

export const buildHealthInsight = label => {
  if (!label) {
    return {
      summary: 'No disease prediction available.',
      disclaimer: 'This is not a medical diagnosis.',
    };
  }

  const normalized = label.toLowerCase();
  const matchedKey = Object.keys(insightRules).find(key => normalized.includes(key));

  return {
    summary: matchedKey
      ? insightRules[matchedKey]
      : 'No specific systemic association rule found. Monitor changes and consult a clinician if symptoms persist.',
    disclaimer: 'This is not a medical diagnosis.',
  };
};
