import { useState, useEffect, useMemo } from 'react';
import { Recipe, RecipeFilter } from '../types/Recipe';
import { recipeAPI } from '../services/recipeAPI';

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

  // Enhanced search suggestions with global recipe database
  useEffect(() => {
    if (filter.search.length > 0) {
      const searchTerm = filter.search.toLowerCase();
      const suggestions = new Set<string>();
      
      // First, add exact matches from our current recipes
      recipes.forEach(recipe => {
        if (recipe.title.toLowerCase().includes(searchTerm)) {
          suggestions.add(recipe.title);
        }
        
        // Add matching tags
        recipe.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchTerm)) {
            suggestions.add(tag);
          }
        });
        
        // Add matching ingredients (first few words only for cleaner suggestions)
        recipe.ingredients.forEach(ingredient => {
          const ingredientWords = ingredient.toLowerCase().split(' ').slice(0, 3).join(' ');
          if (ingredientWords.includes(searchTerm)) {
            suggestions.add(ingredientWords);
          }
        });
      });

      // Then add suggestions from global recipe database
      globalRecipeDatabase.forEach(recipeName => {
        if (recipeName.toLowerCase().includes(searchTerm)) {
          suggestions.add(recipeName);
        }
      });

      // Add partial matches and fuzzy suggestions
      if (suggestions.size < 5) {
        globalRecipeDatabase.forEach(recipeName => {
          const words = recipeName.toLowerCase().split(' ');
          const searchWords = searchTerm.split(' ');
          
          // Check if any word in the recipe name starts with any search word
          const hasPartialMatch = words.some(word => 
            searchWords.some(searchWord => 
              word.startsWith(searchWord) || searchWord.startsWith(word)
            )
          );
          
          if (hasPartialMatch) {
            suggestions.add(recipeName);
          }
        });
      }

      // Convert to array and limit to 8 suggestions
      const suggestionArray = Array.from(suggestions).slice(0, 8);
      
      // Sort suggestions by relevance
      suggestionArray.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        
        // Exact matches first
        if (aLower === searchTerm && bLower !== searchTerm) return -1;
        if (bLower === searchTerm && aLower !== searchTerm) return 1;
        
        // Starts with search term
        if (aLower.startsWith(searchTerm) && !bLower.startsWith(searchTerm)) return -1;
        if (bLower.startsWith(searchTerm) && !aLower.startsWith(searchTerm)) return 1;
        
        // Contains search term
        if (aLower.includes(searchTerm) && !bLower.includes(searchTerm)) return -1;
        if (bLower.includes(searchTerm) && !aLower.includes(searchTerm)) return 1;
        
        return 0;
      });

      setSearchSuggestions(suggestionArray);
    } else {
      setSearchSuggestions([]);
    }
  }, [filter.search, recipes]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRecipes(prev => prev.map(recipe => ({
        ...recipe,
        rating: Math.max(4.0, Math.min(5.0, recipe.rating + (Math.random() - 0.5) * 0.02))
      })));
    }, 30000); // Update ratings every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredRecipes = useMemo(() => {
    const filtered = recipes.filter(recipe => {
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
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        // Exact title matches first
        if (aTitle === searchTerm && bTitle !== searchTerm) return -1;
        if (bTitle === searchTerm && aTitle !== searchTerm) return 1;
        
        // Title starts with search term
        if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1;
        if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1;
        
        // Title contains search term
        if (aTitle.includes(searchTerm) && !bTitle.includes(searchTerm)) return -1;
        if (bTitle.includes(searchTerm) && !aTitle.includes(searchTerm)) return 1;
        
        // Sort by rating as secondary criteria
        return b.rating - a.rating;
      });
    }

    return filtered;
  }, [recipes, filter, favorites]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const addRecipe = (newRecipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    const recipe: Recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setRecipes(prev => [recipe, ...prev]);
    return recipe.id;
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    ));
  };

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  return {
    recipes: filteredRecipes,
    allRecipes: recipes,
    filter,
    setFilter,
    favorites,
    toggleFavorite,
    addRecipe,
    updateRecipe,
    getRecipeById,
    searchSuggestions
  };
};