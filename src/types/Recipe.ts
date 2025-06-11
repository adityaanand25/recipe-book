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