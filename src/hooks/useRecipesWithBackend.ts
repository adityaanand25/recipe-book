import { useState, useEffect, useMemo } from 'react';
import { Recipe, RecipeFilter } from '../types/Recipe';
import { recipeAPI, checkBackendConnection } from '../services/recipeAPI';
import { mockRecipes } from '../data/recipes';

export const useRecipesBackend = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState<RecipeFilter>({
    search: '',
    category: 'All Categories',
    difficulty: 'All',
    maxTime: 180
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [useBackend, setUseBackend] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('recipe-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('recipe-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkBackendConnection();
        setIsConnected(connected);
        setUseBackend(connected);
        
        if (!connected) {
          console.warn('Backend API not available, using local data');
          setRecipes(mockRecipes);
          setAllRecipes(mockRecipes);
        }
      } catch (error) {
        console.error('Failed to check backend connection:', error);
        setIsConnected(false);
        setUseBackend(false);
        setRecipes(mockRecipes);
        setAllRecipes(mockRecipes);
      }
    };

    checkConnection();
  }, []);

  // Fetch recipes from backend or use local data
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!useBackend) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedRecipes = await recipeAPI.getRecipes(filter);
        setRecipes(fetchedRecipes);
        
        // Also fetch all recipes for local operations
        if (filter.search === '' && filter.category === 'All Categories' && 
            filter.difficulty === 'All' && filter.maxTime === 180) {
          setAllRecipes(fetchedRecipes);
        }
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
        setError('Failed to fetch recipes from server');
        
        // Fallback to local data
        if (allRecipes.length === 0) {
          setRecipes(mockRecipes);
          setAllRecipes(mockRecipes);
          setUseBackend(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [filter, useBackend]);

  // Enhanced search suggestions with live search
  useEffect(() => {
    const getSuggestions = async () => {
      if (!filter.search || filter.search.length < 2) {
        setSearchSuggestions([]);
        return;
      }

      if (!useBackend || !isConnected) {
        // Fallback to local search suggestions
        const searchTerm = filter.search.toLowerCase();
        const localSuggestions = new Set<string>();
        
        // Add matches from current recipes
        recipes.forEach(recipe => {
          if (recipe.title.toLowerCase().includes(searchTerm)) {
            localSuggestions.add(recipe.title);
          }
          recipe.tags.forEach(tag => {
            if (tag.toLowerCase().includes(searchTerm)) {
              localSuggestions.add(tag);
            }
          });
        });
        
        setSearchSuggestions(Array.from(localSuggestions).slice(0, 8));
        return;
      }

      try {
        const suggestions = await recipeAPI.getSearchSuggestions(filter.search);
        setSearchSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to get search suggestions:', error);
        setSearchSuggestions([]);
      }
    };

    // Debounce the search suggestions
    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [filter.search, useBackend, isConnected, recipes]);

  // Real-time search with live search endpoint
  const performLiveSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      if (useBackend && isConnected) {
        try {
          const allRecipes = await recipeAPI.getRecipes();
          setRecipes(allRecipes);
        } catch (error) {
          console.error('Failed to fetch all recipes:', error);
        }
      }
      return;
    }

    if (useBackend && isConnected) {
      try {
        setLoading(true);
        const results = await recipeAPI.liveSearch(searchTerm, 20);
        setRecipes(results);
      } catch (error) {
        console.error('Live search failed:', error);
        // Fallback to regular search
        const filteredRecipes = mockRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setRecipes(filteredRecipes);
      } finally {
        setLoading(false);
      }
    }
  };

  // Debounced live search effect
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (filter.search !== '') {
        performLiveSearch(filter.search);
      }
    }, 500);

    return () => clearTimeout(searchTimer);
  }, [filter.search, useBackend, isConnected]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const addRecipe = async (newRecipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    if (useBackend && isConnected) {
      try {
        const createdRecipe = await recipeAPI.createRecipe(newRecipe);
        setRecipes(prev => [createdRecipe, ...prev]);
        setAllRecipes(prev => [createdRecipe, ...prev]);
        return createdRecipe.id;
      } catch (error) {
        console.error('Failed to create recipe on backend:', error);
      }
    }
    
    // Fallback to local creation
    const recipe: Recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setRecipes(prev => [recipe, ...prev]);
    setAllRecipes(prev => [recipe, ...prev]);
    return recipe.id;
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    if (useBackend && isConnected) {
      try {
        const updatedRecipe = await recipeAPI.updateRecipe(id, updates as Recipe);
        setRecipes(prev => prev.map(recipe => 
          recipe.id === id ? updatedRecipe : recipe
        ));
        setAllRecipes(prev => prev.map(recipe => 
          recipe.id === id ? updatedRecipe : recipe
        ));
        return;
      } catch (error) {
        console.error('Failed to update recipe on backend:', error);
      }
    }
    
    // Fallback to local update
    setRecipes(prev => prev.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    ));
    setAllRecipes(prev => prev.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    ));
  };

  const deleteRecipe = async (id: string) => {
    if (useBackend && isConnected) {
      try {
        await recipeAPI.deleteRecipe(id);
      } catch (error) {
        console.error('Failed to delete recipe on backend:', error);
      }
    }
    
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    setAllRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id) || 
           allRecipes.find(recipe => recipe.id === id);
  };

  // Process recipes with favorites
  const processedRecipes = useMemo(() => {
    return recipes.map(recipe => ({
      ...recipe,
      isFavorite: favorites.includes(recipe.id)
    }));
  }, [recipes, favorites]);

  return {
    recipes: processedRecipes,
    allRecipes,
    filter,
    setFilter,
    favorites,
    toggleFavorite,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    searchSuggestions,
    loading,
    error,
    isConnected,
    useBackend
  };
};
