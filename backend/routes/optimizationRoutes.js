import express from 'express';
import Recipe from '../models/Recipe.js';
import Substitution from '../models/Substitution.js';
import { 
  calculateRecipeScore, 
  findMissingIngredients, 
  findSubstitutions, 
  calculateRecipeWithSubstitutions 
} from '../services/optimizationService.js';

const router = express.Router();

router.post('/recipes', async (req, res) => {
  try {
    const {
      availableIngredients = [],
      dietaryRestrictions = [],
      nutritionalGoals = {},
      budgetConstraints = {},
      maxResults = 10
    } = req.body;

    const userPreferences = {
      dietaryRestrictions,
      nutritionalGoals,
      budgetConstraints
    };

    const allRecipes = await Recipe.find();

    const scoredRecipes = allRecipes.map(recipe => {
      const score = calculateRecipeScore(recipe, userPreferences, availableIngredients);
      const missingIngredients = findMissingIngredients(recipe.ingredients, availableIngredients);
      
      return {
        ...recipe.toObject(),
        optimizationScore: score,
        missingIngredients: missingIngredients,
        ingredientMatchPercentage: Math.round(((recipe.ingredients.length - missingIngredients.length) / recipe.ingredients.length) * 100)
      };
    });

    const optimizedRecipes = scoredRecipes
      .sort((a, b) => b.optimizationScore - a.optimizationScore)
      .slice(0, maxResults);

    res.status(200).json({
      success: true,
      message: 'Recipes optimized successfully',
      count: optimizedRecipes.length,
      optimizationCriteria: {
        availableIngredients: availableIngredients.length,
        dietaryRestrictions,
        nutritionalGoals,
        budgetConstraints
      },
      data: optimizedRecipes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error optimizing recipes',
      error: error.message
    });
  }
});

router.post('/match-ingredients', async (req, res) => {
  try {
    const { availableIngredients, minMatchPercentage = 50 } = req.body;

    if (!availableIngredients || availableIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Available ingredients are required'
      });
    }

    const allRecipes = await Recipe.find();

    const matchedRecipes = allRecipes
      .map(recipe => {
        const missingIngredients = findMissingIngredients(recipe.ingredients, availableIngredients);
        const matchPercentage = Math.round(((recipe.ingredients.length - missingIngredients.length) / recipe.ingredients.length) * 100);
        
        return {
          ...recipe.toObject(),
          ingredientMatchPercentage: matchPercentage,
          missingIngredients: missingIngredients
        };
      })
      .filter(recipe => recipe.ingredientMatchPercentage >= minMatchPercentage)
      .sort((a, b) => b.ingredientMatchPercentage - a.ingredientMatchPercentage);

    res.status(200).json({
      success: true,
      message: 'Ingredient matching completed',
      count: matchedRecipes.length,
      criteria: {
        availableIngredients,
        minMatchPercentage
      },
      data: matchedRecipes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error matching ingredients',
      error: error.message
    });
  }
});

router.post('/substitutions', async (req, res) => {
  try {
    const { 
      ingredientName, 
      amount, 
      unit, 
      dietaryRestrictions = [] 
    } = req.body;

    if (!ingredientName) {
      return res.status(400).json({
        success: false,
        message: 'Ingredient name is required'
      });
    }

    const substitutes = await findSubstitutions(ingredientName, dietaryRestrictions);

    if (substitutes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No substitutions found for ${ingredientName}`,
        data: []
      });
    }

    const adjustedSubstitutes = substitutes.map(sub => ({
      ...sub,
      adjustedAmount: amount ? (amount * sub.ratio) : sub.ratio,
      adjustedUnit: unit || 'unit',
      originalAmount: amount,
      originalUnit: unit
    }));

    res.status(200).json({
      success: true,
      message: 'Substitutions found successfully',
      originalIngredient: {
        name: ingredientName,
        amount,
        unit
      },
      count: adjustedSubstitutes.length,
      data: adjustedSubstitutes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding substitutions',
      error: error.message
    });
  }
});

router.post('/add-substitution', async (req, res) => {
  try {
    const substitution = new Substitution(req.body);
    const savedSubstitution = await substitution.save();
    
    res.status(201).json({
      success: true,
      message: 'Substitution added successfully',
      data: savedSubstitution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding substitution',
      error: error.message
    });
  }
});

router.post('/recipe-with-substitutions', async (req, res) => {
  try {
    const { 
      recipeId, 
      availableIngredients = [], 
      dietaryRestrictions = [] 
    } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const substitutionSuggestions = await calculateRecipeWithSubstitutions(
      recipe, 
      availableIngredients, 
      dietaryRestrictions
    );

    res.status(200).json({
      success: true,
      message: 'Recipe with substitutions calculated',
      recipe: recipe,
      substitutionSuggestions: substitutionSuggestions,
      availableIngredients: availableIngredients,
      dietaryRestrictions: dietaryRestrictions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating recipe substitutions',
      error: error.message
    });
  }
});

export default router;
