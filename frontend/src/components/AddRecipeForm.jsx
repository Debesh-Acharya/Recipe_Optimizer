import React, { useState } from 'react';
import { 
  PlusIcon, 
  XMarkIcon, 
  ClockIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  TrashIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { recipeAPI, handleAPIError } from '../services/api';

const AddRecipeForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    difficulty: 'medium',
    cuisine: 'american',
    dietaryTags: [],
    ingredients: [{ name: '', amount: '', unit: 'cups', category: 'other', isOptional: false }],
    instructions: [''],
    nutrition: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sodium: ''
    },
    estimatedCost: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', emoji: '🟢' },
    { value: 'medium', label: 'Medium', emoji: '🟡' },
    { value: 'hard', label: 'Hard', emoji: '🔴' }
  ];

  const cuisineOptions = [
    'italian', 'chinese', 'indian', 'mexican', 'american', 'french', 'thai', 'other'
  ];

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein'
  ];

  const unitOptions = [
    'cups', 'tbsp', 'tsp', 'oz', 'lbs', 'grams', 'kg', 'ml', 'liters', 'pieces', 'cloves'
  ];

  const categoryOptions = [
    'protein', 'vegetable', 'fruit', 'grain', 'dairy', 'spice', 'oil', 'other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (field, subfield, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  const addArrayItem = (field, defaultValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleDietaryTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...prev.dietaryTags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Clean up data before submission
      const cleanedData = {
        ...formData,
        nutrition: Object.fromEntries(
          Object.entries(formData.nutrition).map(([key, value]) => [
            key, 
            value === '' ? undefined : Number(value)
          ])
        ),
        estimatedCost: formData.estimatedCost === '' ? undefined : Number(formData.estimatedCost),
        ingredients: formData.ingredients.filter(ing => ing.name.trim() !== ''),
        instructions: formData.instructions.filter(inst => inst.trim() !== '')
      };

      const response = await recipeAPI.createRecipe(cleanedData);
      onSuccess?.(response.data.data);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Recipe</h2>
              <p className="text-gray-400">Add your culinary masterpiece</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="glass rounded-xl p-4 border border-red-800/30 bg-red-500/10">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5 text-violet-400" />
            <span>Basic Information</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Recipe Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300"
                placeholder="Enter recipe title..."
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 resize-none"
                placeholder="Describe your recipe..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <UserGroupIcon className="w-4 h-4 inline mr-1" />
                  Servings
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.servings}
                  onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <ClockIcon className="w-4 h-4 inline mr-1" />
                  Prep (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.prepTime}
                  onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cook (min)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.cookTime}
                  onChange={(e) => handleInputChange('cookTime', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('difficulty', option.value)}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      formData.difficulty === option.value
                        ? 'bg-violet-500/20 border-violet-500/50 text-violet-400'
                        : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cuisine</label>
              <select
                value={formData.cuisine}
                onChange={(e) => handleInputChange('cuisine', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                {cuisineOptions.map((cuisine) => (
                  <option key={cuisine} value={cuisine} className="bg-gray-800">
                    {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Dietary Tags</label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleDietaryTagToggle(tag)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      formData.dietaryTags.includes(tag)
                        ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                        : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:border-gray-600/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                Estimated Cost per Serving
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.estimatedCost}
                onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <BeakerIcon className="w-5 h-5 text-emerald-400" />
            <span>Ingredients</span>
          </h3>

          <div className="space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Ingredient</label>
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                    placeholder="e.g., flour"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                    placeholder="1"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Unit</label>
                  <select
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit} className="bg-gray-800">{unit}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                  <select
                    value={ingredient.category}
                    onChange={(e) => handleIngredientChange(index, 'category', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 flex justify-center">
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem('ingredients', { name: '', amount: '', unit: 'cups', category: 'other', isOptional: false })}
              className="w-full py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Ingredient</span>
            </button>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-blue-400" />
            <span>Instructions</span>
          </h3>

          <div className="space-y-4">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-sm font-medium mt-1">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <textarea
                    value={instruction}
                    onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
                    placeholder={`Step ${index + 1} instructions...`}
                  />
                </div>
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('instructions', index)}
                    className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 mt-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayItem('instructions', '')}
              className="w-full py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Step</span>
            </button>
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5 text-yellow-400" />
            <span>Nutrition Information (Optional)</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Calories</label>
              <input
                type="number"
                min="0"
                value={formData.nutrition.calories}
                onChange={(e) => handleNestedChange('nutrition', 'calories', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Protein (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.nutrition.protein}
                onChange={(e) => handleNestedChange('nutrition', 'protein', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Carbs (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.nutrition.carbs}
                onChange={(e) => handleNestedChange('nutrition', 'carbs', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Fat (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.nutrition.fat}
                onChange={(e) => handleNestedChange('nutrition', 'fat', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Fiber (g)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.nutrition.fiber}
                onChange={(e) => handleNestedChange('nutrition', 'fiber', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Sodium (mg)</label>
              <input
                type="number"
                min="0"
                value={formData.nutrition.sodium}
                onChange={(e) => handleNestedChange('nutrition', 'sodium', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 font-medium hover:bg-gray-700/50 transition-all duration-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4" />
                <span>Create Recipe</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipeForm;
