# 🍳 Smart Recipe Optimizer

An intelligent full-stack application that uses algorithms to optimize recipe recommendations based on available ingredients, dietary preferences, nutritional goals, and budget constraints.

![Smart Recipe Optimizer](https://img.shields.io/badge/Status-Complete-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18+-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

## 🌟 Features

### 🤖 **Smart AI Optimization**
- **Multi-factor scoring algorithm** (0-100 points) based on ingredient availability, dietary compliance, nutritional alignment, and cost efficiency
- **Intelligent ingredient matching** with percentage-based compatibility scoring
- **Advanced substitution engine** with dietary-aware alternatives
- **Real-time recipe ranking** using sophisticated business logic

### 🍽️ **Comprehensive Recipe Management**
- **Full CRUD operations** - Create, read, update, delete recipes
- **Advanced search and filtering** with real-time results
- **Rich recipe data model** including nutrition, cost estimation, and dietary tags
- **Professional form validation** with comprehensive error handling

### 🎨 **Modern User Interface**
- **Dark theme with glassmorphism** design using Tailwind CSS v4.0
- **Responsive design** that works on desktop, tablet, and mobile
- **Smooth animations** and micro-interactions for enhanced UX
- **Professional loading states** and success feedback

### 📊 **Advanced Analytics**
- **Optimization scoring breakdown** showing how recipes rank
- **Missing ingredient detection** with smart suggestions
- **Cost analysis** per serving with budget constraints
- **Nutritional goal tracking** and alignment scoring

---

## 🛠️ Tech Stack

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

### **Frontend**
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4.0** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Axios** - HTTP client

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recipes` | Get all recipes |
| `POST` | `/api/recipes` | Create new recipe |
| `GET` | `/api/recipes/:id` | Get single recipe |
| `PUT` | `/api/recipes/:id` | Update recipe |
| `DELETE` | `/api/recipes/:id` | Delete recipe |
| `POST` | `/api/optimize/recipes` | **Smart recipe optimization** |
| `POST` | `/api/optimize/match-ingredients` | **Ingredient-based matching** |
| `POST` | `/api/optimize/substitutions` | **Get ingredient substitutions** |
| `POST` | `/api/optimize/recipe-with-substitutions` | **Recipe analysis with alternatives** |
| `POST` | `/api/optimize/add-substitution` | Add substitution data |

**📖 [Complete API Documentation](./docs/API.md)**

---

## 🏗️ Project Structure

```
smart-recipe-optimizer/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── Recipe.js            # Recipe data model
│   │   ├── Substitution.js      # Substitution data model
│   │   └── UserPreference.js    # User preferences model
│   ├── routes/
│   │   ├── recipeRoutes.js      # Recipe CRUD endpoints
│   │   └── optimizationRoutes.js # Smart optimization endpoints
│   ├── services/
│   │   └── optimizationService.js # AI optimization algorithms
│   ├── app.js                   # Express app configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecipeCard.jsx   # Recipe display component
│   │   │   ├── AddRecipeForm.jsx # Recipe creation form
│   │   │   ├── RecipeOptimizer.jsx # Optimization interface
│   │   │   └── EditRecipeModal.jsx # Edit functionality
│   │   ├── services/
│   │   │   └── api.js           # API client with error handling
│   │   ├── App.jsx              # Main application component
│   │   └── index.css            # Tailwind CSS v4.0 styles
│   └── package.json
├── docs/
│   └── API.md                   # Comprehensive API documentation
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB Atlas** account (free tier works)
- **Git** for version control

### 1. Clone Repository
```
git clone https://github.com/yourusername/smart-recipe-optimizer.git
cd smart-recipe-optimizer
```

### 2. Backend Setup
```
cd backend
npm install

# Create .env file
echo "MONGODB_URI=your_mongodb_atlas_connection_string" > .env
echo "PORT=5000" >> .env

# Start backend server
npm run dev
```

**Backend will run on:** `http://localhost:5000`

### 3. Frontend Setup
```
cd ../frontend
npm install

# Start frontend development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### 4. Test the API
```
# Test basic endpoint
curl http://localhost:5000/api/recipes

# Test optimization endpoint
curl -X POST http://localhost:5000/api/optimize/recipes \
  -H "Content-Type: application/json" \
  -d '{"availableIngredients": ["flour", "milk"], "maxResults": 5}'
```

---

## 🧮 Smart Optimization Algorithm

The heart of the application is a sophisticated multi-factor scoring system:

| **Factor** | **Weight** | **Description** |
|------------|------------|-----------------|
| **Ingredient Availability** | 40% | How many ingredients you already have |
| **Dietary Compliance** | 25% | Matches your dietary restrictions perfectly |
| **Nutritional Alignment** | 20% | Proximity to your nutritional goals |
| **Cost Efficiency** | 15% | Fits within your budget constraints |

### Algorithm Details
```
// Simplified scoring logic
const optimizationScore = 
  (ingredientMatch * 0.40) +
  (dietaryCompliance * 0.25) +
  (nutritionalAlignment * 0.20) +
  (costEfficiency * 0.15);
```

---

## 🗄️ Database Schema

### Recipe Model
```
{
  title: String,              // Recipe name
  description: String,        // Recipe description
  servings: Number,           // Number of servings
  prepTime: Number,           // Preparation time (minutes)
  cookTime: Number,           // Cooking time (minutes)
  difficulty: String,         // easy | medium | hard
  cuisine: String,            // Cuisine type
  dietaryTags: [String],      // Dietary restrictions/benefits
  ingredients: [{
    name: String,             // Ingredient name
    amount: Number,           // Quantity
    unit: String,             // Measurement unit
    category: String,         // Ingredient category
    isOptional: Boolean       // Whether ingredient is optional
  }],
  instructions: [String],     // Step-by-step instructions
  nutrition: {
    calories: Number,         // Per serving
    protein: Number,          // Grams
    carbs: Number,            // Grams
    fat: Number,              // Grams
    fiber: Number,            // Grams
    sodium: Number            // Milligrams
  },
  estimatedCost: Number       // Cost per serving
}
```

### Substitution Model
```
{
  originalIngredient: String,
  substitutes: [{
    ingredient: String,
    ratio: Number,              // Conversion ratio
    dietaryBenefits: [String],  // Dietary advantages
    costFactor: Number,         // Relative cost multiplier
    nutritionalImpact: {        // Nutritional differences
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    },
    notes: String               // Usage instructions
  }]
}
```

---

## 🧪 Testing

### Manual Testing with Postman
1. Import the API endpoints from the documentation
2. Test all CRUD operations
3. Verify optimization algorithms with different criteria
4. Test error handling and edge cases

### Sample Test Data
```
# Create a test recipe
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chocolate Chip Cookies",
    "description": "Classic homemade cookies",
    "servings": 24,
    "prepTime": 15,
    "cookTime": 12,
    "difficulty": "easy",
    "cuisine": "american",
    "dietaryTags": ["vegetarian"],
    "ingredients": [
      {"name": "flour", "amount": 2, "unit": "cups", "category": "grain"},
      {"name": "chocolate chips", "amount": 1, "unit": "cups", "category": "other"}
    ],
    "instructions": ["Preheat oven", "Mix ingredients", "Bake"],
    "nutrition": {"calories": 180, "protein": 3, "carbs": 25, "fat": 8},
    "estimatedCost": 0.5
  }'
```

### Development Guidelines
- Follow existing code style and patterns
- Add comprehensive comments for complex algorithms
- Test all new features thoroughly
- Update documentation for API changes

---
