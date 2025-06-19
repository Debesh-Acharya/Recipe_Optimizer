import mongoose from 'mongoose';

const substitutionSchema = new mongoose.Schema({
  originalIngredient: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  substitutes: [{
    ingredient: { 
      type: String, 
      required: true,
      trim: true
    },
    ratio: { 
      type: Number, 
      default: 1 
    }, 
    dietaryBenefits: [{ 
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein']
    }],
    costFactor: { 
      type: Number, 
      default: 1 
    }, 
    nutritionalImpact: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    },
    notes: String 
  }]
}, {
  timestamps: true
});

const Substitution = mongoose.model('Substitution', substitutionSchema);

export default Substitution;
