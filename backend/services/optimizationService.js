import Substitution from '../models/Substitution.js';

export const findSubstitutions = async (ingredientName, dietaryRestrictions = []) => {
  try {
    const substitutionEntry = await Substitution.findOne({ 
      originalIngredient: ingredientName.toLowerCase() 
    });
    
    if (!substitutionEntry) return [];

    return substitutionEntry.substitutes
      .filter(sub => {
        if (dietaryRestrictions.length === 0) return true;
        
        return dietaryRestrictions.some(restriction => 
          sub.dietaryBenefits.includes(restriction)
        );
      })
      .map(sub => ({
        ...sub.toObject(),
        adjustedAmount: sub.ratio 
      }));
  } catch (error) {
    console.error('Error finding substitutions:', error);
    return [];
  }
};

export const calculateRecipeWithSubstitutions = async (recipe, availableIngredients, dietaryRestrictions = []) => {
  const missingIngredients = findMissingIngredients(recipe.ingredients, availableIngredients);
  const substitutionSuggestions = [];

  for (const missingIngredient of missingIngredients) {
    const substitutes = await findSubstitutions(missingIngredient.name, dietaryRestrictions);
    if (substitutes.length > 0) {
      substitutionSuggestions.push({
        originalIngredient: missingIngredient,
        substitutes: substitutes.map(sub => ({
          ...sub,
          adjustedAmount: missingIngredient.amount * sub.ratio,
          adjustedUnit: missingIngredient.unit
        }))
      });
    }
  }

  return substitutionSuggestions;
};
const calculateIngredientMatch = (recipeIngredients, availableIngredients) => {
  if (!availableIngredients || availableIngredients.length === 0) return 0;
  
  const totalIngredients = recipeIngredients.length;
  const matchedIngredients = recipeIngredients.filter(ingredient => 
    availableIngredients.some(available => 
      available.toLowerCase().includes(ingredient.name.toLowerCase()) ||
      ingredient.name.toLowerCase().includes(available.toLowerCase())
    ) || ingredient.isOptional
  ).length;
  
  return matchedIngredients / totalIngredients;
};

const checkDietaryCompliance = (recipeTags, userRestrictions) => {
  if (!userRestrictions || userRestrictions.length === 0) return 1;
  
  return userRestrictions.every(restriction => 
    recipeTags.includes(restriction)
  ) ? 1 : 0;
};

const calculateNutritionalAlignment = (recipeNutrition, nutritionalGoals) => {
  if (!nutritionalGoals) return 0.5;
  
  let score = 0;
  let factors = 0;
  
  if (nutritionalGoals.targetCalories) {
    const caloriesDiff = Math.abs(recipeNutrition.calories - nutritionalGoals.targetCalories);
    const caloriesScore = Math.max(0, 1 - (caloriesDiff / nutritionalGoals.targetCalories));
    score += caloriesScore;
    factors++;
  }
  
  if (nutritionalGoals.targetProtein) {
    const proteinDiff = Math.abs(recipeNutrition.protein - nutritionalGoals.targetProtein);
    const proteinScore = Math.max(0, 1 - (proteinDiff / nutritionalGoals.targetProtein));
    score += proteinScore;
    factors++;
  }
  
  return factors > 0 ? score / factors : 0.5;
};

const calculateCostEfficiency = (recipeCost, budgetConstraints) => {
  if (!budgetConstraints || !budgetConstraints.maxCostPerServing) return 0.5;
  
  if (recipeCost <= budgetConstraints.maxCostPerServing) {
    return 1 - (recipeCost / budgetConstraints.maxCostPerServing);
  }
  
  return 0; 
};

export const calculateRecipeScore = (recipe, userPreferences, availableIngredients) => {
  let score = 0;
  
  const ingredientMatch = calculateIngredientMatch(recipe.ingredients, availableIngredients);
  score += ingredientMatch * 40;
  
  const dietaryScore = checkDietaryCompliance(recipe.dietaryTags, userPreferences.dietaryRestrictions);
  score += dietaryScore * 25;
  
  const nutritionScore = calculateNutritionalAlignment(recipe.nutrition, userPreferences.nutritionalGoals);
  score += nutritionScore * 20;
  
  const costScore = calculateCostEfficiency(recipe.estimatedCost, userPreferences.budgetConstraints);
  score += costScore * 15;
  
  return Math.round(score);
};

export const findMissingIngredients = (recipeIngredients, availableIngredients) => {
  return recipeIngredients.filter(ingredient => 
    !availableIngredients.some(available => 
      available.toLowerCase().includes(ingredient.name.toLowerCase()) ||
      ingredient.name.toLowerCase().includes(available.toLowerCase())
    ) && !ingredient.isOptional
  );
};
