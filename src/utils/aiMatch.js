/**
 * aiMatch.js
 * TRAVGOD AI LocalMatch Algorithm Simulator
 * 
 * Weights:
 * - Language: 40%
 * - Interests: 35%
 * - Budget: 25%
 */

export function calculateMatch(userPrefs, guide) {
  let score = 0;
  const reasons = [];

  // 1. Language Match (40%)
  if (userPrefs.language) {
    if (guide.languages.includes(userPrefs.language)) {
      score += 40;
      reasons.push(`Speaks ${userPrefs.language}`);
    } else {
      // Small penalty or no points for no shared language
      reasons.push(`Does not speak ${userPrefs.language}`);
    }
  } else {
    score += 40; // Default if user doesn't specify
  }

  // 2. Budget Match (25%)
  if (userPrefs.budget) {
    if (userPrefs.budget === 'low' && guide.rate <= 20) {
      score += 25;
      reasons.push('Matches your budget');
    } else if (userPrefs.budget === 'medium' && guide.rate > 20 && guide.rate <= 40) {
      score += 25;
      reasons.push('Matches your budget');
    } else if (userPrefs.budget === 'high' && guide.rate > 40) {
      score += 25;
      reasons.push('Matches your premium budget');
    } else {
      // Partial points for being close
      score += 10;
      reasons.push('Slightly outside your budget');
    }
  } else {
    score += 25;
  }

  // 3. Interests Match (35%)
  if (userPrefs.interests && userPrefs.interests.length > 0) {
    let matchedInterests = 0;
    userPrefs.interests.forEach(interest => {
      if (guide.interests.includes(interest.toLowerCase())) {
        matchedInterests++;
      }
    });

    const interestRatio = matchedInterests / userPrefs.interests.length;
    score += (interestRatio * 35);

    if (matchedInterests > 0) {
      reasons.push(`Shares ${matchedInterests} of your interests`);
    } else {
      reasons.push('Different interests');
    }
  } else {
    score += 35;
  }

  return {
    score: Math.round(score),
    explanation: reasons.join(' • ')
  };
}
