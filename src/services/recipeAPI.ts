// Frontend API service for connecting to FastAPI backend
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookingTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  rating: number;
  author: string;
  createdAt: Date;
  isFavorite?: boolean;
}

export interface RecipeFilter {
  search: string;
  category: string;
  difficulty: string;
  maxTime: number;
}

export interface SearchSuggestion {
  suggestions: string[];
}

export interface RecipeStats {
  total_recipes: number;
  categories: Record<string, number>;
  difficulties: Record<string, number>;
  average_rating: number;
  global_database_size: number;
}

class RecipeAPIService {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  // Convert API response to frontend format
  private convertAPIRecipe(apiRecipe: any): Recipe {
    return {
      ...apiRecipe,
      createdAt: typeof apiRecipe.createdAt === 'string' 
        ? new Date(apiRecipe.createdAt) 
        : apiRecipe.createdAt
    };
  }

  // Convert frontend recipe to API format
  private convertToAPIRecipe(recipe: Recipe): any {
    return {
      ...recipe,
      createdAt: recipe.createdAt instanceof Date 
        ? recipe.createdAt.toISOString() 
        : recipe.createdAt
    };
  }

  // Generic fetch wrapper with error handling
  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      throw error;
    }
  }
  // Recipe CRUD operations
  async getRecipes(filters?: Partial<RecipeFilter>): Promise<Recipe[]> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category && filters.category !== 'All Categories') {
      params.append('category', filters.category);
    }
    if (filters?.difficulty && filters.difficulty !== 'All') {
      params.append('difficulty', filters.difficulty);
    }
    if (filters?.maxTime) params.append('maxTime', filters.maxTime.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/recipes?${queryString}` : '/recipes';
    
    const apiRecipes = await this.fetchAPI<any[]>(endpoint);
    return apiRecipes.map(recipe => this.convertAPIRecipe(recipe));
  }

  async getRecipe(id: string): Promise<Recipe> {
    const apiRecipe = await this.fetchAPI<any>(`/recipes/${id}`);
    return this.convertAPIRecipe(apiRecipe);
  }

  async createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> {
    const recipeData = {
      ...recipe,
      id: Date.now().toString(), // Generate a simple ID
      createdAt: new Date().toISOString(),
    };

    const apiRecipe = await this.fetchAPI<any>('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
    return this.convertAPIRecipe(apiRecipe);
  }

  async updateRecipe(id: string, recipe: Recipe): Promise<Recipe> {
    const apiRecipeData = this.convertToAPIRecipe(recipe);
    const apiRecipe = await this.fetchAPI<any>(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiRecipeData),
    });
    return this.convertAPIRecipe(apiRecipe);
  }

  async deleteRecipe(id: string): Promise<{ message: string }> {
    return this.fetchAPI<{ message: string }>(`/recipes/${id}`, {
      method: 'DELETE',
    });
  }
  // Search and suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return [];
    
    const params = new URLSearchParams({ q: query });
    const response = await this.fetchAPI<SearchSuggestion>(`/search/suggestions?${params}`);
    return response.suggestions;
  }

  // Live search for real-time results
  async liveSearch(query: string, limit: number = 10): Promise<Recipe[]> {
    if (!query.trim()) return [];
    
    const params = new URLSearchParams({ 
      q: query,
      limit: limit.toString() 
    });
    const apiRecipes = await this.fetchAPI<any[]>(`/search/live?${params}`);
    return apiRecipes.map(recipe => this.convertAPIRecipe(recipe));
  }

  // Get popular search terms
  async getPopularSearches(): Promise<string[]> {
    const response = await this.fetchAPI<{ popular_searches: string[] }>('/search/popular');
    return response.popular_searches;
  }

  // Categories and metadata
  async getCategories(): Promise<string[]> {
    const response = await this.fetchAPI<{ categories: string[] }>('/categories');
    return response.categories;
  }

  async getStats(): Promise<RecipeStats> {
    return this.fetchAPI<RecipeStats>('/stats');
  }
  // Bulk operations
  async bulkImportRecipes(recipes: Recipe[]): Promise<{
    imported_count: number;
    total_submitted: number;
    errors: string[];
  }> {
    const apiRecipes = recipes.map(recipe => this.convertToAPIRecipe(recipe));
    return this.fetchAPI('/bulk-import', {
      method: 'POST',
      body: JSON.stringify(apiRecipes),
    });
  }

  // Health check
  async healthCheck(): Promise<{ message: string }> {
    return this.fetchAPI<{ message: string }>('/');
  }

  // Real-time search with debouncing
  async searchWithDebounce(
    query: string,
    filters?: Partial<RecipeFilter>,
    debounceMs: number = 300
  ): Promise<Recipe[]> {
    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    return new Promise((resolve, reject) => {
      this.searchTimeout = setTimeout(async () => {
        try {
          const results = await this.getRecipes({
            search: query,
            ...filters,
          });
          resolve(results);
        } catch (error) {
          reject(error);
        }
      }, debounceMs);
    });
  }

  private searchTimeout: number | null = null;
}

// Create and export a singleton instance
export const recipeAPI = new RecipeAPIService();

// Export the class for custom instances
export { RecipeAPIService };

// Utility functions for frontend integration
export const createRecipeFilter = (
  search = '',
  category = 'All Categories',
  difficulty = 'All',
  maxTime = 180
): RecipeFilter => ({
  search,
  category,
  difficulty,
  maxTime,
});

// Error handling utilities
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown): string => {
  if (error instanceof APIError) {
    return `API Error: ${error.message}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Connection status utility
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    await recipeAPI.healthCheck();
    return true;
  } catch {
    return false;
  }
};
