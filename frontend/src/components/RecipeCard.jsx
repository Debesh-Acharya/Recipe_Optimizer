import React from 'react';
import { 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon,
  FireIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const RecipeCard = ({ recipe, onOptimize, onEdit, onDelete, showOptimization = false }) => {
  const {
    _id,
    title,
    description,
    prepTime,
    cookTime,
    servings,
    difficulty,
    cuisine,
    dietaryTags,
    optimizationScore,
    ingredientMatchPercentage,
    estimatedCost
  } = recipe;

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      easy: { color: 'emerald', icon: '🟢', bg: 'emerald-500/20', border: 'emerald-500/30', text: 'emerald-400' },
      medium: { color: 'yellow', icon: '🟡', bg: 'yellow-500/20', border: 'yellow-500/30', text: 'yellow-400' },
      hard: { color: 'red', icon: '🔴', bg: 'red-500/20', border: 'red-500/30', text: 'red-400' }
    };
    return configs[difficulty] || configs.medium;
  };

  const difficultyConfig = getDifficultyConfig(difficulty);

  return (
    <div className="group glass rounded-2xl p-6 shadow-dark border border-gray-800/30 hover:border-primary-500/30 transition-all duration-300 hover:shadow-glow">
      {/* Header with Action Buttons */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {showOptimization && optimizationScore && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <StarIcon className="h-6 w-6 text-yellow-400" />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur animate-pulse"></div>
              </div>
              <span className="font-bold text-yellow-400 text-lg">{optimizationScore}</span>
            </div>
          )}
          
          {/* Edit & Delete Buttons */}
          {onEdit && (
            <button
              onClick={() => onEdit(recipe)}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
              title="Edit Recipe"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(recipe)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
              title="Delete Recipe"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Rest of your existing RecipeCard code... */}
      {/* Recipe Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <ClockIcon className="h-4 w-4 text-primary-400" />
          <span className="text-sm">{prepTime + cookTime}m</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <UserGroupIcon className="h-4 w-4 text-emerald-400" />
          <span className="text-sm">{servings} servings</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <FireIcon className="h-4 w-4 text-violet-400" />
          <span className="text-sm">${estimatedCost?.toFixed(2) || 'N/A'}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${difficultyConfig.bg} border border-${difficultyConfig.border} text-${difficultyConfig.text}`}>
          {difficultyConfig.icon} {difficulty}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 border border-blue-500/30 text-blue-400">
          {cuisine}
        </span>
        {dietaryTags?.slice(0, 2).map((tag, index) => (
          <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 border border-purple-500/30 text-purple-400">
            {tag}
          </span>
        ))}
        {dietaryTags?.length > 2 && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 border border-gray-500/30 text-gray-400">
            +{dietaryTags.length - 2} more
          </span>
        )}
      </div>

      {/* Optimization Info */}
      {showOptimization && ingredientMatchPercentage !== undefined && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Ingredient Match</span>
            <span className="text-sm font-semibold text-primary-400">{ingredientMatchPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${ingredientMatchPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button 
        onClick={() => onOptimize?.(recipe)}
        className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-primary-500/20 to-violet-500/20 border border-primary-500/30 rounded-xl text-primary-400 font-medium hover:from-primary-500/30 hover:to-violet-500/30 hover:border-primary-400/50 transition-all duration-300 group-hover:shadow-glow"
      >
        <div className="flex items-center justify-center space-x-2">
          <SparklesIcon className="h-4 w-4" />
          <span>View Details</span>
        </div>
      </button>
    </div>
  );
};

export default RecipeCard;
