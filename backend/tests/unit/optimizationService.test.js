import { describe, test, expect } from '@jest/globals';
import { 
  calculateRecipeScore, 
  findMissingIngredients
} from '../../services/optimizationService.js';

describe('Optimization Service Unit Tests', () => {
  describe('findMissingIngredients', () => {
    test('should return missing ingredients correctly', () => {
      const recipeIngredients = [
        { name: 'flour', amount: 2, unit: 'cups', isOptional: false },
        { name: 'milk', amount: 1, unit: 'cups', isOptional: false },
        { name: 'vanilla', amount: 1, unit: 'tsp', isOptional: true }
      ];
      const availableIngredients = ['flour'];

      const result = findMissingIngredients(recipeIngredients, availableIngredients);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('milk'); // Fixed: Added [0] to access first element
    });

    test('should handle optional ingredients correctly', () => {
      const recipeIngredients = [
        { name: 'flour', amount: 2, unit: 'cups', isOptional: false },
        { name: 'vanilla', amount: 1, unit: 'tsp', isOptional: true }
      ];
      const availableIngredients = ['flour'];

      const result = findMissingIngredients(recipeIngredients, availableIngredients);
      
      expect(result).toHaveLength(0); // Optional ingredients should not be missing
    });

    test('should return empty array when all ingredients available', () => {
      const recipeIngredients = [
        { name: 'flour', amount: 2, unit: 'cups', isOptional: false },
        { name: 'milk', amount: 1, unit: 'cups', isOptional: false }
      ];
      const availableIngredients = ['flour', 'milk'];

      const result = findMissingIngredients(recipeIngredients, availableIngredients);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('calculateRecipeScore', () => {
    test('should calculate correct optimization score with all factors', () => {
      const recipe = {
        ingredients: [
          { name: 'flour', amount: 2, unit: 'cups', isOptional: false },
          { name: 'milk', amount: 1, unit: 'cups', isOptional: false }
        ],
        dietaryTags: ['vegetarian'],
        nutrition: {
          calories: 400,
          protein: 10,
          carbs: 50,
          fat: 15
        },
        estimatedCost: 3.0
      };

      const userPreferences = {
        dietaryRestrictions: ['vegetarian'],
        nutritionalGoals: {
          targetCalories: 400,
          targetProtein: 10
        },
        budgetConstraints: {
          maxCostPerServing: 5.0
        }
      };

      const availableIngredients = ['flour', 'milk'];

      const result = calculateRecipeScore(recipe, userPreferences, availableIngredients);
      
      expect(result).toBeGreaterThan(80); // Should be high score for perfect match
      expect(typeof result).toBe('number');
    });

    test('should penalize missing ingredients correctly', () => {
      const recipe = {
        ingredients: [
          { name: 'flour', amount: 2, unit: 'cups', isOptional: false },
          { name: 'milk', amount: 1, unit: 'cups', isOptional: false },
          { name: 'eggs', amount: 2, unit: 'pieces', isOptional: false },
          { name: 'butter', amount: 0.5, unit: 'cups', isOptional: false }
        ],
        dietaryTags: ['vegetarian'],
        nutrition: {
          calories: 400,
          protein: 10
        },
        estimatedCost: 3.0
      };

      const userPreferences = {
        dietaryRestrictions: ['vegetarian'],
        nutritionalGoals: {
          targetCalories: 400,
          targetProtein: 10
        },
        budgetConstraints: {
          maxCostPerServing: 5.0
        }
      };

      const availableIngredients = ['flour', 'milk']; // Missing eggs and butter

      const result = calculateRecipeScore(recipe, userPreferences, availableIngredients);
      
      expect(result).toBeLessThan(80); // Should be lower due to missing ingredients
    });

    test('should handle dietary restriction violations', () => {
      const recipe = {
        ingredients: [
          { name: 'flour', amount: 2, unit: 'cups', isOptional: false }
        ],
        dietaryTags: ['vegetarian'], // Recipe is vegetarian
        nutrition: { calories: 400 },
        estimatedCost: 3.0
      };

      const userPreferences = {
        dietaryRestrictions: ['vegan'], // User wants vegan
        nutritionalGoals: {},
        budgetConstraints: {}
      };

      const availableIngredients = ['flour'];

      const result = calculateRecipeScore(recipe, userPreferences, availableIngredients);
      
      expect(result).toBeLessThan(65); // Should lose 25 points for dietary mismatch
    });

    test('should handle budget constraints', () => {
      const recipe = {
        ingredients: [
          { name: 'flour', amount: 2, unit: 'cups', isOptional: false }
        ],
        dietaryTags: ['vegetarian'],
        nutrition: { calories: 400 },
        estimatedCost: 10.0 // Expensive recipe
      };

      const userPreferences = {
        dietaryRestrictions: ['vegetarian'],
        nutritionalGoals: {},
        budgetConstraints: {
          maxCostPerServing: 5.0 // Budget limit
        }
      };

      const availableIngredients = ['flour'];

      const result = calculateRecipeScore(recipe, userPreferences, availableIngredients);
      
      expect(result).toBeLessThan(85); // Should lose points for being over budget
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty available ingredients', () => {
      const recipeIngredients = [
        { name: 'flour', amount: 2, unit: 'cups', isOptional: false }
      ];
      const availableIngredients = [];

      const result = findMissingIngredients(recipeIngredients, availableIngredients);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('flour'); // Fixed: Added [0] to access first element
    });

    test('should handle null/undefined inputs gracefully', () => {
      expect(() => {
        findMissingIngredients([], null);
      }).not.toThrow();

      expect(() => {
        calculateRecipeScore({ingredients: []}, {}, []);
      }).not.toThrow();
    });

    test('should handle case-insensitive ingredient matching', () => {
      const recipeIngredients = [
        { name: 'Flour', amount: 2, unit: 'cups', isOptional: false },
        { name: 'MILK', amount: 1, unit: 'cups', isOptional: false }
      ];
      const availableIngredients = ['flour', 'milk'];

      const result = findMissingIngredients(recipeIngredients, availableIngredients);
      
      expect(result).toHaveLength(0); // Should match case-insensitively
    });
  });
});
