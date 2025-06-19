import React, { useState } from 'react';
import { 
  BeakerIcon, 
  MagnifyingGlassIcon,
  SparklesIcon,
  PlusIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { recipeAPI, handleAPIError } from '../services/api';
import RecipeCard from './RecipeCard';

const RecipeOptimizer = () => {
  const [optimizationCriteria, setOptimizationCriteria] = useState({
    availableIngredients: [],
    dietaryRestrictions: [],
    nutritionalGoals: {
      targetCalories: '',
      targetProtein: '',
      targetCarbs: '',
      targetFat: ''
    },
    budgetConstraints: {
      maxCostPerServing: '',
      preferBudgetOptions: false
    },
    maxResults: 10
  });

  const [currentIngredient, setCurrentIngredient] = useState('');
  const [optimizedRecipes, setOptimizedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein'
  ];

  const addIngredient = () => {
    if (currentIngredient.trim() && !optimizationCriteria.availableIngredients.includes(currentIngredient.trim().toLowerCase())) {
      setOptimizationCriteria(prev => ({
        ...prev,
        availableIngredients: [...prev.availableIngredients, currentIngredient.trim().toLowerCase()]
      }));
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient) => {
    setOptimizationCriteria(prev => ({
      ...prev,
      availableIngredients: prev.availableIngredients.filter(ing => ing !== ingredient)
    }));
  };

  const toggleDietaryRestriction = (restriction) => {
    setOptimizationCriteria(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const handleNutritionalGoalChange = (field, value) => {
    setOptimizationCriteria(prev => ({
      ...prev,
      nutritionalGoals: {
        ...prev.nutritionalGoals,
        [field]: value
      }
    }));
  };

  const handleBudgetChange = (field, value) => {
    setOptimizationCriteria(prev => ({
      ...prev,
      budgetConstraints: {
        ...prev.budgetConstraints,
        [field]: field === 'preferBudgetOptions' ? value : value
      }
    }));
  };

  const optimizeRecipes = async () => {
    if (optimizationCriteria.availableIngredients.length === 0) {
      setError('Please add at least one ingredient to optimize recipes.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Clean up criteria before sending
      const cleanedCriteria = {
        ...optimizationCriteria,
        nutritionalGoals: Object.fromEntries(
          Object.entries(optimizationCriteria.nutritionalGoals).map(([key, value]) => [
            key, 
            value === '' ? undefined : Number(value)
          ])
        ),
        budgetConstraints: {
          ...optimizationCriteria.budgetConstraints,
          maxCostPerServing: optimizationCriteria.budgetConstraints.maxCostPerServing === '' 
            ? undefined 
            : Number(optimizationCriteria.budgetConstraints.maxCostPerServing)
        }
      };

      const response = await recipeAPI.optimizeRecipes(cleanedCriteria);
      setOptimizedRecipes(response.data.data || []);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setOptimizationCriteria({
      availableIngredients: [],
      dietaryRestrictions: [],
      nutritionalGoals: {
        targetCalories: '',
        targetProtein: '',
        targetCarbs: '',
        targetFat: ''
      },
      budgetConstraints: {
        maxCostPerServing: '',
        preferBudgetOptions: false
      },
      maxResults: 10
    });
    setOptimizedRecipes([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <BeakerIcon className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl blur opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Recipe Optimizer</h2>
            <p className="text-gray-400">Find perfect recipes based on your ingredients and preferences</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-primary-400">{optimizationCriteria.availableIngredients.length}</div>
            <div className="text-xs text-gray-400">Ingredients</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-400">{optimizationCriteria.dietaryRestrictions.length}</div>
            <div className="text-xs text-gray-400">Dietary Filters</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-emerald-400">{optimizedRecipes.length}</div>
            <div className="text-xs text-gray-400">Matches Found</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">{optimizationCriteria.maxResults}</div>
            <div className="text-xs text-gray-400">Max Results</div>
          </div>
        </div>
      </div>

      {/* Optimization Criteria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Ingredients */}
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5 text-emerald-400" />
            <span>Available Ingredients</span>
          </h3>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Add ingredient (e.g., flour, milk, eggs)"
              />
              <button
                onClick={addIngredient}
                className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-all duration-300"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {optimizationCriteria.availableIngredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm"
                >
                  <span>{ingredient}</span>
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="hover:text-emerald-300 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {optimizationCriteria.availableIngredients.length === 0 && (
                <span className="text-gray-500 text-sm italic">No ingredients added yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <StarIcon className="w-5 h-5 text-purple-400" />
            <span>Dietary Preferences</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {dietaryOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleDietaryRestriction(option)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  optimizationCriteria.dietaryRestrictions.includes(option)
                    ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                    : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:border-gray-600/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Nutritional Goals */}
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-blue-400" />
            <span>Nutritional Goals</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target Calories</label>
              <input
                type="number"
                min="0"
                value={optimizationCriteria.nutritionalGoals.targetCalories}
                onChange={(e) => handleNutritionalGoalChange('targetCalories', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                placeholder="400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target Protein (g)</label>
              <input
                type="number"
                min="0"
                value={optimizationCriteria.nutritionalGoals.targetProtein}
                onChange={(e) => handleNutritionalGoalChange('targetProtein', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                placeholder="20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target Carbs (g)</label>
              <input
                type="number"
                min="0"
                value={optimizationCriteria.nutritionalGoals.targetCarbs}
                onChange={(e) => handleNutritionalGoalChange('targetCarbs', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Target Fat (g)</label>
              <input
                type="number"
                min="0"
                value={optimizationCriteria.nutritionalGoals.targetFat}
                onChange={(e) => handleNutritionalGoalChange('targetFat', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                placeholder="15"
              />
            </div>
          </div>
        </div>

        {/* Budget Constraints */}
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CurrencyDollarIcon className="w-5 h-5 text-yellow-400" />
            <span>Budget Constraints</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Max Cost per Serving</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={optimizationCriteria.budgetConstraints.maxCostPerServing}
                onChange={(e) => handleBudgetChange('maxCostPerServing', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
                placeholder="5.00"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Max Results</label>
              <select
                value={optimizationCriteria.maxResults}
                onChange={(e) => setOptimizationCriteria(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
              >
                <option value={5}>5 recipes</option>
                <option value={10}>10 recipes</option>
                <option value={15}>15 recipes</option>
                <option value={20}>20 recipes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={clearAll}
          className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 font-medium hover:bg-gray-700/50 transition-all duration-300"
        >
          Clear All
        </button>
        <button
          onClick={optimizeRecipes}
          disabled={loading || optimizationCriteria.availableIngredients.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl text-white font-medium hover:from-primary-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Find Perfect Recipes</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass rounded-xl p-4 border border-red-800/30 bg-red-500/10">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Optimized Results</h3>
            {optimizedRecipes.length > 0 && (
              <span className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-medium">
                {optimizedRecipes.length} matches found
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Analyzing recipes with AI optimization...</p>
            </div>
          ) : optimizedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">No matches found</h4>
              <p className="text-gray-400 mb-4">Try adjusting your criteria or adding more ingredients</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {optimizedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  showOptimization={true}
                  onOptimize={(recipe) => console.log('View recipe:', recipe)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeOptimizer;
