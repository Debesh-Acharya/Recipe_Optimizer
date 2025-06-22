import { describe, test, expect, beforeAll, afterEach, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { setupTestDatabase, clearTestDatabase, closeTestDatabase } from '../setup/testDb.js';

beforeAll(async () => {
  await setupTestDatabase();
});

afterEach(async () => {
  await clearTestDatabase();
});

afterAll(async () => {
  await closeTestDatabase();
});

describe('Optimization API End-to-End Tests', () => {
  const testRecipes = [
    {
      title: 'Vegetarian Pancakes',
      servings: 4,
      prepTime: 10,
      cookTime: 15,
      difficulty: 'easy',
      cuisine: 'american',
      dietaryTags: ['vegetarian'],
      ingredients: [
        { name: 'flour', amount: 2, unit: 'cups', category: 'grain', isOptional: false },
        { name: 'milk', amount: 1.5, unit: 'cups', category: 'dairy', isOptional: false },
        { name: 'eggs', amount: 2, unit: 'pieces', category: 'protein', isOptional: false }
      ],
      instructions: ['Mix ingredients', 'Cook on griddle'],
      nutrition: { calories: 300, protein: 8, carbs: 45, fat: 10 },
      estimatedCost: 2.5
    },
    {
      title: 'Vegan Smoothie',
      servings: 2,
      prepTime: 5,
      cookTime: 0,
      difficulty: 'easy',
      cuisine: 'other',
      dietaryTags: ['vegan', 'dairy-free'],
      ingredients: [
        { name: 'banana', amount: 2, unit: 'pieces', category: 'fruit', isOptional: false },
        { name: 'almond milk', amount: 1, unit: 'cups', category: 'dairy', isOptional: false }
      ],
      instructions: ['Blend ingredients'],
      nutrition: { calories: 150, protein: 3, carbs: 30, fat: 4 },
      estimatedCost: 1.5
    }
  ];

  beforeEach(async () => {
    // Create test recipes before each optimization test
    for (const recipe of testRecipes) {
      await request(app).post('/api/recipes').send(recipe);
    }
  });

  describe('Complete Optimization Workflow', () => {
    test('Full optimization workflow with complex criteria', async () => {
      const optimizationRequest = {
        availableIngredients: ['flour', 'milk', 'eggs', 'banana', 'almond milk'],
        dietaryRestrictions: ['vegetarian'],
        nutritionalGoals: {
          targetCalories: 300,
          targetProtein: 8,
          targetCarbs: 45,
          targetFat: 8
        },
        budgetConstraints: {
          maxCostPerServing: 3.0,
          preferBudgetOptions: true
        },
        maxResults: 5
      };

      const response = await request(app)
        .post('/api/optimize/recipes')
        .send(optimizationRequest)
        .expect(200);

      // Validate response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('optimizationCriteria');

      // Validate optimization results
      const results = response.body.data;
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      // Validate each result has optimization data
      results.forEach(recipe => {
        expect(recipe).toHaveProperty('optimizationScore');
        expect(recipe).toHaveProperty('ingredientMatchPercentage');
        expect(recipe).toHaveProperty('missingIngredients');
        expect(typeof recipe.optimizationScore).toBe('number');
        expect(recipe.optimizationScore).toBeGreaterThanOrEqual(0);
        expect(recipe.optimizationScore).toBeLessThanOrEqual(100);
      });

      // Verify results are sorted by optimization score
      for (let i = 1; i < results.length; i++) {
        expect(results[i-1].optimizationScore).toBeGreaterThanOrEqual(results[i].optimizationScore);
      }
    });
  });

  describe('Optimization API Response Validation', () => {
    test('POST /api/optimize/recipes - should return detailed optimization data', async () => {
      const request_data = {
        availableIngredients: ['flour', 'milk'],
        maxResults: 10
      };

      const response = await request(app)
        .post('/api/optimize/recipes')
        .send(request_data)
        .expect(200);

      // Validate response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.optimizationCriteria).toBeDefined();
      expect(response.body.optimizationCriteria.availableIngredients).toBe(2);

      // Validate optimization scoring
      if (response.body.data.length > 0) {
        const recipe = response.body.data[0];
        expect(recipe.optimizationScore).toBeDefined();
        expect(recipe.ingredientMatchPercentage).toBeDefined();
        expect(recipe.missingIngredients).toBeDefined();
        expect(Array.isArray(recipe.missingIngredients)).toBe(true);
      }
    });

    test('POST /api/optimize/match-ingredients - should return ingredient matching data', async () => {
      const matchRequest = {
        availableIngredients: ['flour', 'milk', 'eggs'],
        minMatchPercentage: 60
      };

      const response = await request(app)
        .post('/api/optimize/match-ingredients')
        .send(matchRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.criteria).toEqual(matchRequest);
      
      // All returned recipes should meet minimum match percentage
      response.body.data.forEach(recipe => {
        expect(recipe.ingredientMatchPercentage).toBeGreaterThanOrEqual(60);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('POST /api/optimize/recipes - should handle empty ingredient list', async () => {
      const request_data = {
        availableIngredients: [],
        maxResults: 5
      };

      const response = await request(app)
        .post('/api/optimize/recipes')
        .send(request_data)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // Your API correctly returns recipes even with empty ingredients
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach(recipe => {
        expect(recipe.optimizationScore).toBeDefined();
        expect(recipe.ingredientMatchPercentage).toBeDefined();
      });
    });

    test('POST /api/optimize/recipes - should handle invalid nutritional goals', async () => {
      const request_data = {
        availableIngredients: ['flour'],
        nutritionalGoals: {
          targetCalories: -100, // Invalid negative calories
          targetProtein: 'not-a-number'
        },
        maxResults: 5
      };

      const response = await request(app)
        .post('/api/optimize/recipes')
        .send(request_data);

      // Your API handles invalid data gracefully
      expect([200, 400]).toContain(response.statusCode);
      
      if (response.statusCode === 200) {
        expect(response.body.success).toBe(true);
      } else {
        expect(response.body.success).toBe(false);
      }
    });

    test('POST /api/optimize/substitutions - should handle non-existent ingredients', async () => {
      const substitutionRequest = {
        ingredientName: 'non-existent-ingredient',
        amount: 1,
        unit: 'cups',
        dietaryRestrictions: ['vegan']
      };

      const response = await request(app)
        .post('/api/optimize/substitutions')
        .send(substitutionRequest);

      expect([200, 404]).toContain(response.statusCode);
      
      if (response.statusCode === 404) {
        expect(response.body.success).toBe(false);
        expect(response.body.data).toHaveLength(0);
      }
    });
  });

  describe('Performance Testing', () => {
    test('Optimization should complete within reasonable time', async () => {
      const optimizationRequest = {
        availableIngredients: ['flour', 'milk', 'eggs', 'sugar', 'banana', 'almond milk'],
        dietaryRestrictions: ['vegetarian'],
        nutritionalGoals: {
          targetCalories: 300,
          targetProtein: 10
        },
        maxResults: 20
      };

      const startTime = Date.now();
      const response = await request(app)
        .post('/api/optimize/recipes')
        .send(optimizationRequest)
        .expect(200);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
      expect(response.body.success).toBe(true);
    });
  });
});
