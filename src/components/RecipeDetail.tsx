import React from 'react';
import { ArrowLeft, Clock, Users, Star, Heart, ChefHat, Calendar } from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, onToggleFavorite }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        
        <button
          onClick={() => onToggleFavorite(recipe.id)}
          className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg ${
            recipe.isFavorite 
              ? 'bg-red-500/90 text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-red-500/90 hover:text-white'
          }`}
        >
          <Heart className={`w-6 h-6 ${recipe.isFavorite ? 'fill-current' : ''}`} />
        </button>
        
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {recipe.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-lg text-white/90">{recipe.description}</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recipe Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-700">Cook Time</span>
                  </div>
                  <span className="font-semibold">{recipe.cookingTime} mins</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Servings</span>
                  </div>
                  <span className="font-semibold">{recipe.servings}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-gray-700">Rating</span>
                  </div>
                  <span className="font-semibold">{recipe.rating.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Chef</span>
                  </div>
                  <span className="font-semibold text-sm">{recipe.author}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Created</span>
                  </div>
                  <span className="font-semibold text-sm">
                    {recipe.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map(tag => (
                    <span key={tag} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-800">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h3>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;