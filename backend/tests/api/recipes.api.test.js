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

describe('Recipe API End-to-End Tests', () => {
  const validRecipe = {
    title: 'API Test Recipe',
    description: 'Comprehensive API testing recipe',
    servings: 6,
    prepTime: 20,
    cookTime: 30,
    difficulty: 'medium',
    cuisine: 'italian',
    dietaryTags: ['vegetarian', 'gluten-free'],
    ingredients: [
      { name: 'rice flour', amount: 2, unit: 'cups', category: 'grain', isOptional: false },
      { name: 'tomatoes', amount: 4, unit: 'pieces', category: 'vegetable', isOptional: false }
    ],
    instructions: [
      'Prepare rice flour mixture',
      'Chop tomatoes finely',
      'Combine ingredients',
      'Cook for 30 minutes'
    ],
    nutrition: {
      calories: 420,
      protein: 15,
      carbs: 60,
      fat: 12,
      fiber: 5,
      sodium: 380
    },
    estimatedCost: 4.2
  };

  describe('Complete API Workflow', () => {
    test('Full CRUD workflow with proper HTTP status codes', async () => {
      // 1. CREATE - POST
      const createResponse = await request(app)
        .post('/api/recipes')
        .send(validRecipe)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data.title).toBe(validRecipe.title);
      const recipeId = createResponse.body.data._id;

      // 2. READ - GET single
      const getSingleResponse = await request(app)
        .get(`/api/recipes/${recipeId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(getSingleResponse.body.success).toBe(true);
      expect(getSingleResponse.body.data._id).toBe(recipeId);

      // 3. READ - GET all
      const getAllResponse = await request(app)
        .get('/api/recipes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(getAllResponse.body.success).toBe(true);
      expect(getAllResponse.body.count).toBe(1);

      // 4. UPDATE - PUT
      const updateData = { title: 'Updated API Recipe', difficulty: 'hard' };
      const updateResponse = await request(app)
        .put(`/api/recipes/${recipeId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.title).toBe(updateData.title);

      // 5. DELETE
      await request(app)
        .delete(`/api/recipes/${recipeId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      // 6. VERIFY DELETION
      await request(app)
        .get(`/api/recipes/${recipeId}`)
        .expect(404);
    });
  });

  describe('API Error Handling', () => {
    test('should return 400 for invalid recipe data', async () => {
      const invalidRecipe = { title: 'A' }; // Too short title

      const response = await request(app)
        .post('/api/recipes')
        .send(invalidRecipe)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    test('should return 404 for non-existent recipe', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

      const response = await request(app)
        .get(`/api/recipes/${fakeId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('should handle malformed JSON requests', async () => {
  const response = await request(app)
    .post('/api/recipes')
    .set('Content-Type', 'application/json')
    .send('{"invalid": json}');

  expect(response.statusCode).toBe(400);
});
  });

  describe('API Response Format Validation', () => {
    test('should return consistent response structure', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .send(validRecipe);

      // Validate response structure
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      
      // Validate data structure
      const recipe = response.body.data;
      expect(recipe).toHaveProperty('_id');
      expect(recipe).toHaveProperty('title');
      expect(recipe).toHaveProperty('createdAt');
      expect(recipe).toHaveProperty('updatedAt');
    });
  });
});
