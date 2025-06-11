import React from 'react';
import { Clock, Users, Star, Heart, ChefHat } from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeClick: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRecipeClick, onToggleFavorite }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer group">
      <div className="relative" onClick={() => onRecipeClick(recipe.id)}>
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              recipe.isFavorite 
                ? 'bg-red-500/90 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-500/90 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-6" onClick={() => onRecipeClick(recipe.id)}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current text-yellow-400" />
              <span>{recipe.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{recipe.author}</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {recipe.category}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;