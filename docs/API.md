# Smart Recipe Optimizer API Documentation

A comprehensive REST API for intelligent recipe management and AI-powered optimization based on ingredients, nutrition, and preferences.

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

No authentication is required for API access.

---

## Recipe Management Endpoints

### 1. Get All Recipes

**GET** `/recipes`  
Retrieve all recipes.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [ /* Recipe objects */ ]
}
```

---

### 2. Get Single Recipe

**GET** `/recipes/:id`  
Fetch a recipe by its ID.

**Params:**
- `id` (string): Recipe ID

**Success:**
```json
{
  "success": true,
  "data": { /* Recipe object */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Recipe not found"
}
```

---

### 3. Create Recipe

**POST** `/recipes`  
Add a new recipe.

**Body:**
```json
{
  "title": "Chocolate Chip Cookies",
  "description": "Classic cookies",
  "servings": 24,
  "prepTime": 15,
  "cookTime": 12,
  "difficulty": "easy",
  "cuisine": "american",
  "dietaryTags": ["vegetarian"],
  "ingredients": [
    { "name": "flour", "amount": 2, "unit": "cups", "category": "grain", "isOptional": false },
    { "name": "chocolate chips", "amount": 1, "unit": "cups", "category": "other", "isOptional": false }
  ],
  "instructions": [
    "Preheat oven to 375°F",
    "Mix ingredients",
    "Bake for 10-12 minutes"
  ],
  "nutrition": {
    "calories": 180,
    "protein": 3,
    "carbs": 25,
    "fat": 8
  },
  "estimatedCost": 0.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": { /* Recipe object */ }
}
```

---

### 4. Update Recipe

**PUT** `/recipes/:id`  
Update an existing recipe (partial updates supported).

**Response:**
```json
{
  "success": true,
  "message": "Recipe updated successfully",
  "data": { /* Updated recipe */ }
}
```

---

### 5. Delete Recipe

**DELETE** `/recipes/:id`  
Delete a recipe by ID.

**Response:**
```json
{
  "success": true,
  "message": "Recipe deleted successfully",
  "data": { /* Deleted recipe */ }
}
```

---

## Smart Optimization Endpoints

### 6. Optimize Recipes

**POST** `/optimize/recipes`  
Get AI suggestions based on ingredients, nutrition, diet, and budget.

**Body:**
```json
{
  "availableIngredients": ["flour", "milk", "eggs", "butter"],
  "dietaryRestrictions": ["vegetarian"],
  "nutritionalGoals": {
    "targetCalories": 400,
    "targetProtein": 10,
    "targetCarbs": 50,
    "targetFat": 15
  },
  "budgetConstraints": {
    "maxCostPerServing": 5.0,
    "preferBudgetOptions": false
  },
  "maxResults": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Recipes optimized successfully",
  "count": 2,
  "data": [
    {
      "_id": "123",
      "title": "Oat Pancakes",
      "optimizationScore": 92,
      "ingredientMatchPercentage": 85,
      "missingIngredients": [
        { "name": "banana", "amount": 1, "unit": "unit", "category": "fruit" }
      ]
    }
  ]
}
```

---

### 7. Match Ingredients

**POST** `/optimize/match-ingredients`  
Find matching recipes with a minimum ingredient match.

**Body:**
```json
{
  "availableIngredients": ["flour", "milk", "eggs"],
  "minMatchPercentage": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ingredient matching completed",
  "count": 1,
  "data": [
    {
      "title": "Pancakes",
      "ingredientMatchPercentage": 75,
      "missingIngredients": [
        { "name": "butter", "amount": 0.5, "unit": "cups" }
      ]
    }
  ]
}
```

---

### 8. Get Ingredient Substitutions

**POST** `/optimize/substitutions`  
Suggest dietary-friendly ingredient replacements.

**Body:**
```json
{
  "ingredientName": "butter",
  "amount": 1,
  "unit": "cups",
  "dietaryRestrictions": ["vegan"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ingredient": "coconut oil",
      "adjustedAmount": 1,
      "adjustedUnit": "cups",
      "ratio": 1,
      "dietaryBenefits": ["vegan", "dairy-free"],
      "costFactor": 1.5,
      "notes": "1:1 substitution"
    }
  ]
}
```

---

### 9. Recipe with Substitutions

**POST** `/optimize/recipe-with-substitutions`  
Suggest substitutions for missing ingredients in a recipe.

**Body:**
```json
{
  "recipeId": "685452d91827ab3c21520977",
  "availableIngredients": ["flour", "milk"],
  "dietaryRestrictions": ["vegan"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Recipe with substitutions calculated",
  "recipe": { /* Full recipe */ },
  "substitutionSuggestions": [
    {
      "originalIngredient": {
        "name": "butter",
        "amount": 0.5,
        "unit": "cups"
      },
      "substitutes": [
        {
          "ingredient": "coconut oil",
          "adjustedAmount": 0.5,
          "adjustedUnit": "cups",
          "ratio": 1,
          "dietaryBenefits": ["vegan"]
        }
      ]
    }
  ]
}
```

---

## Data Management Endpoints

### 10. Add Substitution Data

**POST** `/optimize/add-substitution`  
Add new substitutions to the DB.

**Body:**
```json
{
  "originalIngredient": "butter",
  "substitutes": [
    {
      "ingredient": "coconut oil",
      "ratio": 1,
      "dietaryBenefits": ["vegan", "dairy-free"],
      "costFactor": 1.5,
      "nutritionalImpact": {
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0
      },
      "notes": "1:1 substitution"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Substitution added successfully",
  "data": {
    "_id": "sub123",
    "originalIngredient": "butter",
    "substitutes": [ /* ... */ ]
  }
}
```

---

## Error Handling

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "error": "Validation failed"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Recipe not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Optimization Scoring (0–100)

| Metric               | Points |
|----------------------|--------|
| Ingredient Match     | 40     |
| Dietary Compliance   | 25     |
| Nutritional Goals    | 20     |
| Cost Efficiency      | 15     |

---

## Sample curl Commands

### Get Recipes
```bash
curl -X GET http://localhost:5000/api/recipes
```

### Create Recipe
```bash
curl -X POST http://localhost:5000/api/recipes \
-H "Content-Type: application/json" \
-d '{ "title": "Test Recipe", "description": "Demo", "servings": 2, "ingredients": [{ "name": "flour", "amount": 1, "unit": "cups", "category": "grain" }], "instructions": ["Mix", "Cook"], "estimatedCost": 1.0 }'
```

### Optimize Recipes
```bash
curl -X POST http://localhost:5000/api/optimize/recipes \
-H "Content-Type: application/json" \
-d '{ "availableIngredients": ["flour", "milk"], "dietaryRestrictions": ["vegetarian"], "maxResults": 5 }'
```

---


