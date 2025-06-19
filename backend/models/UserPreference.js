import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein']
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  nutritionalGoals: {
    targetCalories: { type: Number, min: 0 },
    targetProtein: { type: Number, min: 0 },
    targetCarbs: { type: Number, min: 0 },
    targetFat: { type: Number, min: 0 }
  },
  budgetConstraints: {
    maxCostPerServing: { type: Number, min: 0 },
    preferBudgetOptions: { type: Boolean, default: false }
  },
  availableIngredients: [{
    type: String,
    trim: true
  }],
  dislikedIngredients: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

export default UserPreference;
