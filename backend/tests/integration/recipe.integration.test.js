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

describe('Recipe API Integration Tests', () => {
  const testRecipe = {
    title: 'Integration Test Recipe',
    description: 'Testing database integration',
    servings: 4,
    prepTime: 15,
    cookTime: 25,
    difficulty: 'medium',
    cuisine: 'italian',
    dietaryTags: ['vegetarian'],
    ingredients: [
      { name: 'pasta', amount: 2, unit: 'cups', category: 'grain', isOptional: false }
    ],
    instructions: ['Cook pasta'],
    nutrition: { calories: 350, protein: 12 },
    estimatedCost: 3.5
  };

  test('POST /api/recipes - should create recipe with database', async () => {
    const response = await request(app)
      .post('/api/recipes')
      .send(testRecipe);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(testRecipe.title);
  });

  test('GET /api/recipes - should retrieve recipes from database', async () => {
    // Create recipe first
    await request(app).post('/api/recipes').send(testRecipe);

    const response = await request(app).get('/api/recipes');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
  });
});
