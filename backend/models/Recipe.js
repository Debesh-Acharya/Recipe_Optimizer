import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['cups', 'tbsp', 'tsp', 'oz', 'lbs', 'grams', 'kg', 'ml', 'liters', 'pieces', 'cloves']
  },
  category: {
    type: String,
    enum: ['protein', 'vegetable', 'fruit', 'grain', 'dairy', 'spice', 'oil', 'other'],
    default: 'other'
  },
  isOptional: {
    type: Boolean,
    default: false
  }
});

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, min: 0 },
  protein: { type: Number, min: 0 }, 
  carbs: { type: Number, min: 0 },   
  fat: { type: Number, min: 0 },    
  fiber: { type: Number, min: 0 },   
  sodium: { type: Number, min: 0 }   
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  prepTime: {
    type: Number, 
    required: true,
    min: 0
  },
  cookTime: {
    type: Number, 
    required: true,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  cuisine: {
    type: String,
    enum: ['italian', 'chinese', 'indian', 'mexican', 'american', 'french', 'thai', 'other'],
    default: 'other'
  },
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein']
  }],
  ingredients: [ingredientSchema],
  instructions: [{
    type: String,
    required: true
  }],
  nutrition: nutritionSchema,
  estimatedCost: {
    type: Number,
    min: 0 
  }
}, {
  timestamps: true 
});

recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ dietaryTags: 1 });
recipeSchema.index({ cuisine: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
