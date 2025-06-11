import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ChefHat, X, TrendingUp } from 'lucide-react';
import { RecipeFilter } from '../types/Recipe';

interface HeaderProps {
  filter: RecipeFilter;
  onFilterChange: (filter: RecipeFilter) => void;
  favoriteCount: number;
  searchSuggestions: string[];
}

const Header: React.FC<HeaderProps> = ({ 
  filter, 
  onFilterChange, 
  favoriteCount,
  searchSuggestions 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filter, search: value });
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onFilterChange({ ...filter, search: suggestion });
    setShowSuggestions(false);
    setIsSearchFocused(false);
    searchRef.current?.blur();
  };

  const clearSearch = () => {
    onFilterChange({ ...filter, search: '' });
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (filter.search.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchSuggestions.length > 0) {
      handleSuggestionClick(searchSuggestions[0]);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RecipeStream</h1>
              <p className="text-sm text-gray-600">Real-time cooking inspiration</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search any recipe... (try 'manchurian', 'biryani', 'pasta')"
                value={filter.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
                onKeyDown={handleKeyDown}
                className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                  isSearchFocused ? 'shadow-lg' : ''
                }`}
              />
              {filter.search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Enhanced Search Suggestions Dropdown */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
              >
                {searchSuggestions.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Recipe Suggestions</span>
                      </div>
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors flex items-center space-x-3 group"
                      >
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                          {suggestion}
                        </span>
                        {/* Highlight if it's an exact match */}
                        {suggestion.toLowerCase() === filter.search.toLowerCase() && (
                          <span className="ml-auto text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                            Exact match
                          </span>
                        )}
                      </button>
                    ))}
                    <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">
                      Press Enter to search for "{filter.search}" or click a suggestion
                    </div>
                  </>
                ) : filter.search.length > 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-gray-700 font-medium mb-2">
                      Searching for "{filter.search}"
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      We're looking through our recipe database...
                    </p>
                    <div className="text-xs text-gray-400">
                      Try popular dishes like: Manchurian, Biryani, Pasta, Pizza, Curry
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;