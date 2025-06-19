import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { recipeAPI, handleAPIError } from '../services/api';

const EditRecipeModal = ({ recipe, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    servings: recipe?.servings || 4,
    prepTime: recipe?.prepTime || 15,
    cookTime: recipe?.cookTime || 30,
    difficulty: recipe?.difficulty || 'medium',
    cuisine: recipe?.cuisine || 'american',
    dietaryTags: recipe?.dietaryTags || [],
    ingredients: recipe?.ingredients || [{ name: '', amount: '', unit: 'cups', category: 'other', isOptional: false }],
    instructions: recipe?.instructions || [''],
    nutrition: {
      calories: recipe?.nutrition?.calories || '',
      protein: recipe?.nutrition?.protein || '',
      carbs: recipe?.nutrition?.carbs || '',
      fat: recipe?.nutrition?.fat || '',
      fiber: recipe?.nutrition?.fiber || '',
      sodium: recipe?.nutrition?.sodium || ''
    },
    estimatedCost: recipe?.estimatedCost || ''
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

      const response = await recipeAPI.updateRecipe(recipe._id, cleanedData);
      onSuccess?.(response.data.data);
      onClose();
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform glass rounded-2xl shadow-dark border border-gray-800/30">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800/30">
            <h3 className="text-2xl font-bold text-white">Edit Recipe</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-800/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Recipe Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Servings</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.servings}
                      onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prep (min)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.prepTime}
                      onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cook (min)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.cookTime}
                      onChange={(e) => handleInputChange('cookTime', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                    <div className="grid grid-cols-3 gap-2">
                      {difficultyOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange('difficulty', option.value)}
                          className={`p-2 rounded-lg border transition-all duration-300 text-xs ${
                            formData.difficulty === option.value
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                              : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600/50'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-sm mb-1">{option.emoji}</div>
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
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      {cuisineOptions.map((cuisine) => (
                        <option key={cuisine} value={cuisine} className="bg-gray-800">
                          {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dietary Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleDietaryTagToggle(tag)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Cost per Serving</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.estimatedCost}
                    onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 font-medium hover:bg-gray-700/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Recipe</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRecipeModal;
