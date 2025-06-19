import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const recipeAPI = {
  getAllRecipes: () => api.get('/recipes'),
  getRecipe: (id) => api.get(`/recipes/${id}`),
  createRecipe: (recipe) => api.post('/recipes', recipe),
  updateRecipe: (id, recipe) => api.put(`/recipes/${id}`, recipe),
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),

  optimizeRecipes: (criteria) => api.post('/optimize/recipes', criteria),
  matchIngredients: (data) => api.post('/optimize/match-ingredients', data),
  getSubstitutions: (data) => api.post('/optimize/substitutions', data),
  getRecipeWithSubstitutions: (data) => api.post('/optimize/recipe-with-substitutions', data),
  
  addSubstitution: (data) => api.post('/optimize/add-substitution', data),
};

export const handleAPIError = (error) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    return {
      message: 'Network error - please check your connection',
      status: 0,
      data: null
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null
    };
  }
};

export default api;
