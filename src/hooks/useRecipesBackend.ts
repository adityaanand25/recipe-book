import { useState, useEffect, useMemo } from 'react';
import { Recipe, RecipeFilter } from '../types/Recipe';
import { recipeAPI, checkBackendConnection } from '../services/recipeAPI';
import { mockRecipes } from '../data/recipes';

export const useRecipes = () => {
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
      }

      try {
        if (useBackend && isConnected) {
          const suggestions = await recipeAPI.getSearchSuggestions(filter.search);
          setSearchSuggestions(suggestions);
        } else {
          // Fallback to local suggestions
          const searchTerm = filter.search.toLowerCase();
          const suggestions = new Set<string>();
          
          recipes.forEach(recipe => {
            if (recipe.title.toLowerCase().includes(searchTerm)) {
              suggestions.add(recipe.title);
            }
            
            recipe.tags.forEach(tag => {
              if (tag.toLowerCase().includes(searchTerm)) {
                suggestions.add(tag);
              }
            });
          });
          
          setSearchSuggestions(Array.from(suggestions).slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to get search suggestions:', err);
        setSearchSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [filter.search, useBackend, isConnected, recipes]);

  // Apply favorites to recipes
  const recipesWithFavorites = useMemo(() => {
    return recipes.map(recipe => ({
      ...recipe,
      isFavorite: favorites.includes(recipe.id)
    }));
  }, [recipes, favorites]);

  // Local filtering when using mock data
  const filteredRecipes = useMemo(() => {
    if (useBackend) {
      return recipesWithFavorites; // Backend handles filtering
    }

    // Local filtering for mock data
    const filtered = mockRecipes.filter(recipe => {
      const searchTerm = filter.search.toLowerCase();
      const matchesSearch = !searchTerm || 
                           recipe.title.toLowerCase().includes(searchTerm) ||
                           recipe.description.toLowerCase().includes(searchTerm) ||
                           recipe.author.toLowerCase().includes(searchTerm) ||
                           recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                           recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm));
      
      const matchesCategory = filter.category === 'All Categories' || recipe.category === filter.category;
      const matchesDifficulty = filter.difficulty === 'All' || recipe.difficulty === filter.difficulty;
      const matchesTime = recipe.cookingTime <= filter.maxTime;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesTime;
    }).map(recipe => ({
      ...recipe,
      isFavorite: favorites.includes(recipe.id)
    }));

    // Sort by relevance if there's a search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      return filtered.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(searchTerm) ? 2 : 0;
        const bTitle = b.title.toLowerCase().includes(searchTerm) ? 2 : 0;
        const aTags = a.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ? 1 : 0;
        const bTags = b.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ? 1 : 0;
        
        return (bTitle + bTags + b.rating) - (aTitle + aTags + a.rating);
      });
    }

    return filtered;
  }, [useBackend, recipesWithFavorites, filter, favorites]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const addRecipe = async (newRecipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    try {
      if (useBackend && isConnected) {
        const recipe = await recipeAPI.createRecipe(newRecipe);
        // Refresh recipes
        const updatedRecipes = await recipeAPI.getRecipes();
        setRecipes(updatedRecipes);
        setAllRecipes(updatedRecipes);
        return recipe.id;
      } else {
        // Local fallback
        const recipe: Recipe = {
          ...newRecipe,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        setRecipes(prev => [recipe, ...prev]);
        setAllRecipes(prev => [recipe, ...prev]);
        return recipe.id;
      }
    } catch (err) {
      console.error('Failed to add recipe:', err);
      setError('Failed to add recipe');
      throw err;
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      if (useBackend && isConnected) {
        const existingRecipe = recipes.find(r => r.id === id);
        if (!existingRecipe) throw new Error('Recipe not found');
        
        const updatedRecipe = { ...existingRecipe, ...updates };
        await recipeAPI.updateRecipe(id, updatedRecipe);
        
        // Refresh recipes
        const updatedRecipes = await recipeAPI.getRecipes();
        setRecipes(updatedRecipes);
        setAllRecipes(updatedRecipes);
      } else {
        // Local fallback
        setRecipes(prev => prev.map(recipe => 
          recipe.id === id ? { ...recipe, ...updates } : recipe
        ));
        setAllRecipes(prev => prev.map(recipe => 
          recipe.id === id ? { ...recipe, ...updates } : recipe
        ));
      }
    } catch (err) {
      console.error('Failed to update recipe:', err);
      setError('Failed to update recipe');
      throw err;
    }
  };

  const getRecipeById = (id: string) => {
    return allRecipes.find(recipe => recipe.id === id) || 
           recipes.find(recipe => recipe.id === id);
  };

  return {
    recipes: filteredRecipes,
    allRecipes: useBackend ? allRecipes : mockRecipes,
    filter,
    setFilter,
    favorites,
    toggleFavorite,
    addRecipe,
    updateRecipe,
    getRecipeById,
    searchSuggestions,
    loading,
    error,
    isConnected,
    useBackend
  };
};
