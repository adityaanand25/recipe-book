import { useState } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import { useRecipesBackend as useRecipes } from './hooks/useRecipesWithBackend';

type View = 'list' | 'detail';

function App() {
  const { 
    recipes, 
    filter, 
    setFilter, 
    favorites, 
    toggleFavorite, 
    getRecipeById,
    searchSuggestions 
  } = useRecipes();
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const handleRecipeClick = (id: string) => {
    setSelectedRecipeId(id);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedRecipeId(null);
  };

  const selectedRecipe = selectedRecipeId ? getRecipeById(selectedRecipeId) : null;

  if (currentView === 'detail' && selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={handleBackToList}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  const getSearchResultsText = () => {
    if (!filter.search) {
      return `${recipes.length} recipes available`;
    }
    
    if (recipes.length === 0) {
      return `No recipes found for "${filter.search}"`;
    }
    
    return `${recipes.length} recipe${recipes.length === 1 ? '' : 's'} found for "${filter.search}"`;
  };

  const getSearchHelpText = () => {
    if (!filter.search) return null;
    
    if (recipes.length === 0) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Recipe not found? Here are some suggestions:
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Try searching for: <strong>Manchurian, Biryani, Pasta, Pizza, Curry</strong></p>
                <p>• Check for typos in your search term</p>
                <p>• Use more general terms (e.g., "chicken" instead of specific dish names)</p>
                <p>• Browse by category using the filters above</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header
        filter={filter}
        onFilterChange={setFilter}
        favoriteCount={favorites.length}
        searchSuggestions={searchSuggestions}
      />
      
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {filter.search ? 'Search Results' : 'Discover Amazing Recipes'}
              </h2>
              <p className="text-gray-600 mt-2">
                {getSearchResultsText()}
              </p>
              {filter.search && recipes.length > 0 && (
                <p className="text-sm text-orange-600 mt-1">
                  Results are sorted by relevance • Real-time search active
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live updates</span>
            </div>
          </div>
          
          {getSearchHelpText()}
        </div>
        
        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter.search ? `No recipes found for "${filter.search}"` : 'No recipes found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter.search 
                ? 'The recipe you\'re looking for might not be in our current database'
                : 'Try adjusting your filters or search terms'
              }
            </p>
            
            {filter.search && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6 max-w-md mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">Popular Recipe Searches:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Manchurian', 'Biryani', 'Pasta', 'Pizza', 'Curry', 'Noodles'].map(recipe => (
                      <button
                        key={recipe}
                        onClick={() => setFilter({ ...filter, search: recipe })}
                        className="px-3 py-1 bg-white text-orange-700 rounded-full text-sm hover:bg-orange-50 transition-colors"
                      >
                        {recipe}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setFilter({ ...filter, search: '' })}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear search and show all recipes
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onRecipeClick={handleRecipeClick}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;