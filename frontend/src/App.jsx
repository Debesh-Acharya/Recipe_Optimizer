import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, BeakerIcon, PlusIcon, SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { recipeAPI, handleAPIError } from './services/api';
import RecipeCard from './components/RecipeCard';
import AddRecipeForm from './components/AddRecipeForm';
import RecipeOptimizer from './components/RecipeOptimizer';
import EditRecipeModal from './components/EditRecipeModal';

function App() {
  const [activeTab, setActiveTab] = useState('recipes');

  const tabs = [
    { id: 'recipes', name: 'Recipes', icon: MagnifyingGlassIcon, color: 'emerald' },
    { id: 'optimizer', name: 'Optimizer', icon: BeakerIcon, color: 'primary' },
    { id: 'add', name: 'Add Recipe', icon: PlusIcon, color: 'violet' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header with glassmorphism */}
      <header className="relative glass border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-violet-500 rounded-xl flex items-center justify-center shadow-glow">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-violet-500 rounded-xl blur opacity-50 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Recipe Optimizer
                </h1>
                <p className="text-xs text-gray-400 font-medium">Smart Culinary AI</p>
              </div>
            </div>
            
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/30 shadow-lg`
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'animate-pulse' : ''
                    }`} />
                    <span className="hidden sm:inline">{tab.name}</span>
                    {isActive && (
                      <div className={`absolute inset-0 bg-${tab.color}-500/10 rounded-xl blur animate-pulse`}></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'recipes' && <RecipesView setActiveTab={setActiveTab} />}
        {activeTab === 'optimizer' && <OptimizerView />}
        {activeTab === 'add' && <AddRecipeView setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
}

// RecipesView component with edit functionality
const RecipesView = ({ setActiveTab }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipeAPI.getAllRecipes();
      setRecipes(response.data.data || []);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeAction = (recipe) => {
    console.log('Recipe action:', recipe);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  const handleEditSuccess = (updatedRecipe) => {
    setRecipes(prev => prev.map(recipe => 
      recipe._id === updatedRecipe._id ? updatedRecipe : recipe
    ));
    setEditingRecipe(null);
  };

  const handleDelete = async (recipe) => {
    if (!window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      return;
    }

    try {
      await recipeAPI.deleteRecipe(recipe._id);
      setRecipes(prev => prev.filter(r => r._id !== recipe._id));
    } catch (err) {
      const errorInfo = handleAPIError(err);
      alert(`Failed to delete recipe: ${errorInfo.message}`);
      fetchRecipes();
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="glass rounded-2xl p-12 text-center shadow-dark border border-gray-800/30">
        <div className="animate-spin w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Recipes</h2>
        <p className="text-gray-400">Fetching your culinary collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-12 text-center shadow-dark border border-red-800/30">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Error Loading Recipes</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={fetchRecipes}
          className="px-6 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-medium hover:bg-red-500/30 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 shadow-dark border border-gray-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Recipe Collection</h2>
            <p className="text-gray-400">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center shadow-dark border border-gray-800/30">
          {searchTerm ? (
            <>
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your search terms</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-xl text-primary-400 font-medium hover:bg-primary-500/30 transition-all duration-300"
              >
                Clear Search
              </button>
            </>
          ) : (
            <>
              <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No recipes yet</h3>
              <p className="text-gray-400 mb-6">Start building your culinary collection</p>
              <button 
                onClick={() => setActiveTab('add')}
                className="px-6 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium hover:bg-emerald-500/30 transition-all duration-300"
              >
                Add Your First Recipe
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onOptimize={handleRecipeAction}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showOptimization={false}
            />
          ))}
        </div>
      )}

      {filteredRecipes.length > 0 && (
        <div className="glass rounded-2xl p-4 shadow-dark border border-gray-800/30">
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
            <span>Total: {recipes.length} recipes</span>
            <span>•</span>
            <span>Showing: {filteredRecipes.length}</span>
            {searchTerm && (
              <>
                <span>•</span>
                <span>Search: "{searchTerm}"</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditRecipeModal
        recipe={editingRecipe}
        isOpen={!!editingRecipe}
        onClose={() => setEditingRecipe(null)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

// AddRecipeView component
const AddRecipeView = ({ setActiveTab }) => {
  const [showForm, setShowForm] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRecipeSuccess = (newRecipe) => {
    setSuccessMessage(`Recipe "${newRecipe.title}" created successfully!`);
    setShowForm(false);
    
    setTimeout(() => {
      setSuccessMessage(null);
      setShowForm(true);
    }, 5000);
  };

  const handleCancel = () => {
    setShowForm(false);
    setTimeout(() => setShowForm(true), 300);
  };

  if (successMessage) {
    return (
      <div className="glass rounded-2xl p-12 text-center shadow-dark border border-emerald-800/30">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto bg-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Recipe Created!</h2>
        <p className="text-gray-400 text-lg mb-6">{successMessage}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setSuccessMessage(null);
              setShowForm(true);
            }}
            className="px-6 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-medium hover:bg-emerald-500/30 transition-all duration-300"
          >
            Create Another Recipe
          </button>
          <button
            onClick={() => {
              setSuccessMessage(null);
              setActiveTab('recipes');
            }}
            className="px-6 py-2 bg-primary-500/20 border border-primary-500/30 rounded-xl text-primary-400 font-medium hover:bg-primary-500/30 transition-all duration-300"
          >
            View All Recipes
          </button>
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="glass rounded-2xl p-12 text-center shadow-dark border border-gray-800/30">
        <div className="relative mb-6">
          <PlusIcon className="w-16 h-16 text-violet-400 mx-auto" />
          <div className="absolute inset-0 w-16 h-16 mx-auto bg-violet-400/20 rounded-full blur-xl animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Create?</h2>
        <p className="text-gray-400 text-lg mb-6">Add your culinary masterpieces to the collection</p>
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 mx-auto"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Start Creating</span>
        </button>
      </div>
    );
  }

  return (
    <AddRecipeForm 
      onSuccess={handleRecipeSuccess}
      onCancel={handleCancel}
    />
  );
};

// OptimizerView component
const OptimizerView = () => {
  return <RecipeOptimizer />;
};

export default App;
