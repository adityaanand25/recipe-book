from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from datetime import datetime
import json
import re
from difflib import SequenceMatcher
from typing import Set
import asyncio

app = FastAPI(
    title="Recipe Search API",
    description="Real-time recipe search and management API",
    version="1.0.0"
)

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Recipe(BaseModel):
    id: str
    title: str
    description: str
    image: str
    category: str
    difficulty: str
    cookingTime: int
    servings: int
    ingredients: List[str]
    instructions: List[str]
    tags: List[str]
    rating: float
    author: str
    createdAt: datetime
    isFavorite: Optional[bool] = False

class RecipeFilter(BaseModel):
    search: Optional[str] = ""
    category: Optional[str] = "All Categories"
    difficulty: Optional[str] = "All"
    maxTime: Optional[int] = 180

class SearchSuggestion(BaseModel):
    suggestions: List[str]

# In-memory database (replace with actual database in production)
recipes_db: List[Recipe] = []
global_recipe_database = [
    # Breads & Rice
    'Naan', 'Roti', 'Chapati', 'Aloo Paratha', 'Paneer Paratha', 'Methi Paratha', 'Puri',
    'Chicken Biryani', 'Mutton Biryani', 'Veg Biryani', 'Hyderabadi Biryani', 'Thalassery Biryani',
    'Jeera Rice', 'Veg Pulao', 'Peas Pulao', 'Chicken Pulao',
    
    # Vegetarian Dishes
    'Paneer Butter Masala', 'Palak Paneer', 'Chole', 'Chickpea Curry', 'Rajma', 'Kidney Bean Curry',
    'Aloo Gobi', 'Baingan Bharta', 'Bhindi Masala', 'Mix Veg Curry', 'Dum Aloo',
    
    # Non-Vegetarian Dishes
    'Butter Chicken', 'Chicken Tikka Masala', 'Rogan Josh', 'Goan Fish Curry', 'Bengali Fish Curry',
    'Egg Curry', 'Chicken Korma', 'Tandoori Chicken', 'Chicken Chettinad', 'Andhra Chicken Curry',
    'Kodi Kura', 'Kerala Chicken Curry',
    
    # Snacks & Street Food
    'Samosa', 'Pav Bhaji', 'Vada Pav', 'Dhokla', 'Onion Pakora', 'Potato Pakora', 'Paneer Pakora',
    'Aloo Tikki', 'Bhel Chaat', 'Dahi Puri', 'Pani Puri', 'Medu Vada', 'Banana Chips', 'Murukku',
    'Chakli', 'Sundal', 'Punugulu',
    
    # South Indian Dishes & Breads
    'Plain Dosa', 'Masala Dosa', 'Rava Dosa', 'Set Dosa', 'Paper Dosa', 'Mysore Masala Dosa',
    'Neer Dosa', 'Pesarattu', 'Idli', 'Uttapam', 'Appam', 'Pathiri', 'Malabar Parotta',
    
    # Regional Specialties
    'Sambar', 'Rasam', 'Kootu', 'Puli Kuzhambu', 'Vatha Kuzhambu', 'Lemon Rice', 'Tamarind Rice',
    'Puliyodarai', 'Avial', 'Kerala Sadya', 'Erissery', 'Bisi Bele Bath', 'Ragi Mudde', 'Vangi Bath',
    'Gongura Pachadi', 'Pulihora',
    
    # Desserts
    'Gulab Jamun', 'Rasgulla', 'Jalebi', 'Kheer', 'Besan Ladoo', 'Boondi Ladoo', 'Kaju Barfi',
    'Coconut Barfi', 'Milk Barfi', 'Rasmalai', 'Sooji Halwa', 'Gajar Halwa', 'Payasam',
    'Mysore Pak', 'Unniyappam', 'Kesari Bath', 'Bobbatlu', 'Obbattu', 'Poli',
    
    # Indo-Chinese
    'Vegetable Manchurian', 'Chicken Manchurian', 'Chili Chicken', 'Fried Rice', 'Hakka Noodles',
    'Chow Mein',
    
    # Popular International
    'Pizza', 'Pasta', 'Burger', 'Sandwich', 'Fried Chicken', 'Curry', 'Noodles'
]

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two strings"""
    return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()

def get_search_suggestions(search_term: str, recipes: List[Recipe]) -> List[str]:
    """Generate smart search suggestions with enhanced fuzzy matching"""
    if not search_term or len(search_term) < 2:
        return []
    
    search_term_lower = search_term.lower()
    suggestions = set()
    
    # 1. Add exact matches from current recipes
    for recipe in recipes:
        # Title matches
        if search_term_lower in recipe.title.lower():
            suggestions.add(recipe.title)
        
        # Tag matches
        for tag in recipe.tags:
            if search_term_lower in tag.lower():
                suggestions.add(tag)
        
        # Ingredient matches (only main ingredients)
        for ingredient in recipe.ingredients[:5]:  # First 5 ingredients only
            ingredient_lower = ingredient.lower()
            if search_term_lower in ingredient_lower:
                # Extract the main ingredient name (first 2-3 words)
                main_ingredient = ' '.join(ingredient.split()[:3])
                suggestions.add(main_ingredient)
    
    # 2. Add suggestions from global database with enhanced matching
    for recipe_name in global_recipe_database:
        recipe_lower = recipe_name.lower()
        
        # Exact substring match
        if search_term_lower in recipe_lower:
            suggestions.add(recipe_name)
            continue
        
        # Word-based matching
        search_words = search_term_lower.split()
        recipe_words = recipe_lower.split()
        
        # Check if any search word matches any recipe word
        for search_word in search_words:
            for recipe_word in recipe_words:
                if (search_word in recipe_word or recipe_word in search_word or
                    search_word.startswith(recipe_word[:3]) or recipe_word.startswith(search_word[:3])):
                    suggestions.add(recipe_name)
                    break
            else:
                continue
            break
    
    # 3. Add fuzzy matches for short suggestions list
    if len(suggestions) < 6:
        for recipe_name in global_recipe_database:
            similarity = calculate_similarity(search_term, recipe_name)
            if similarity > 0.4:  # Lower threshold for better suggestions
                suggestions.add(recipe_name)
    
    # 4. Convert to list and sort by relevance
    suggestion_list = list(suggestions)[:10]  # Limit to 10 suggestions
    
    # Sort by relevance: exact matches first, then by similarity
    suggestion_list.sort(key=lambda x: (
        # Exact matches first
        0 if search_term_lower in x.lower() else 1,
        # Then by starts with
        0 if x.lower().startswith(search_term_lower) else 1,
        # Then by similarity score (descending)
        -calculate_similarity(search_term, x),
        # Finally by length (shorter names first)
        len(x)
    ))
    
    return suggestion_list[:8]  # Return top 8 suggestions

def filter_recipes(recipes: List[Recipe], filters: RecipeFilter) -> List[Recipe]:
    """Filter recipes based on search criteria"""
    filtered = []
    
    for recipe in recipes:
        # Search filter
        matches_search = True
        if filters.search:
            search_term = filters.search.lower()
            matches_search = (
                search_term in recipe.title.lower() or
                search_term in recipe.description.lower() or
                search_term in recipe.author.lower() or
                any(search_term in tag.lower() for tag in recipe.tags) or
                any(search_term in ingredient.lower() for ingredient in recipe.ingredients)
            )
        
        # Category filter
        matches_category = (
            filters.category == "All Categories" or 
            recipe.category == filters.category
        )
        
        # Difficulty filter
        matches_difficulty = (
            filters.difficulty == "All" or 
            recipe.difficulty == filters.difficulty
        )
        
        # Time filter
        matches_time = recipe.cookingTime <= filters.maxTime
        
        if matches_search and matches_category and matches_difficulty and matches_time:
            filtered.append(recipe)
    
    # Sort by relevance if search term exists
    if filters.search:
        search_term_lower = filters.search.lower()
        filtered.sort(key=lambda r: (
            2 if search_term_lower in r.title.lower() else 
            1 if any(search_term_lower in tag.lower() for tag in r.tags) else 0,
            r.rating
        ), reverse=True)
    
    return filtered

# Initialize with sample data
def init_sample_data():
    """Initialize with comprehensive Indian recipes"""
    global recipes_db
    recipes_db.clear()  # Clear existing data
    
    sample_recipes = [
        {
            "id": "1",
            "title": "Butter Chicken",
            "description": "Creamy and rich North Indian chicken curry",
            "image": "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
            "category": "Main Course",
            "difficulty": "Medium",
            "cookingTime": 45,
            "servings": 4,
            "ingredients": [
                "1 kg chicken, cut into pieces",
                "1 cup tomato puree",
                "1/2 cup heavy cream",
                "2 tbsp butter",
                "1 tbsp garam masala",
                "1 tsp red chili powder",
                "1 tbsp ginger-garlic paste",
                "1 tsp cumin powder",
                "Salt to taste"
            ],
            "instructions": [
                "Marinate chicken with yogurt and spices for 30 minutes",
                "Cook chicken in a pan until done, set aside",
                "In same pan, add butter and tomato puree",
                "Add spices and cook for 10 minutes",
                "Add cream and cooked chicken",
                "Simmer for 15 minutes and serve with rice"
            ],
            "tags": ["Indian", "Non-Vegetarian", "Creamy", "Popular", "North Indian"],
            "rating": 4.8,
            "author": "Chef Rajesh",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "2",
            "title": "Masala Dosa",
            "description": "Crispy South Indian crepe with spiced potato filling",
            "image": "https://images.pexels.com/photos/5560788/pexels-photo-5560788.jpeg",
            "category": "Breakfast",
            "difficulty": "Hard",
            "cookingTime": 45,
            "servings": 6,
            "ingredients": [
                "3 cups dosa batter (fermented)",
                "4 large potatoes, boiled",
                "2 onions, chopped",
                "2 green chilies",
                "1 tsp mustard seeds",
                "10 curry leaves",
                "1/2 tsp turmeric",
                "Oil for cooking"
            ],
            "instructions": [
                "Prepare spiced potato filling",
                "Heat dosa pan and spread batter thinly",
                "Add potato filling on one side",
                "Fold and serve with sambar and chutney"
            ],
            "tags": ["South Indian", "Breakfast", "Vegetarian", "Fermented", "Tamil Nadu"],
            "rating": 4.9,
            "author": "Chef Krishnan",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "3",
            "title": "Chicken Biryani",
            "description": "Aromatic basmati rice layered with spiced chicken",
            "image": "https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg",
            "category": "Main Course",
            "difficulty": "Hard",
            "cookingTime": 90,
            "servings": 6,
            "ingredients": [
                "2 cups basmati rice",
                "1 kg chicken pieces",
                "1 cup yogurt",
                "2 large onions, sliced",
                "2 tsp biryani masala",
                "Saffron soaked in milk",
                "4 tbsp ghee",
                "Whole spices",
                "Fresh mint and cilantro"
            ],
            "instructions": [
                "Marinate chicken with yogurt and spices",
                "Cook rice with whole spices until 70% done",
                "Layer rice and chicken in heavy pot",
                "Top with fried onions and saffron milk",
                "Cook on dum for 45 minutes"
            ],
            "tags": ["Indian", "Biryani", "Chicken", "Aromatic", "Hyderabadi"],
            "rating": 4.9,
            "author": "Chef Hyderabadi",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "4",
            "title": "Paneer Butter Masala",
            "description": "Rich and creamy cottage cheese curry in tomato-based sauce",
            "image": "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
            "category": "Main Course",
            "difficulty": "Medium",
            "cookingTime": 35,
            "servings": 4,
            "ingredients": [
                "400g paneer, cubed",
                "2 cups tomato puree",
                "1/2 cup cream",
                "2 tbsp butter",
                "1 tbsp garam masala",
                "1 tsp red chili powder",
                "1 tbsp ginger-garlic paste",
                "1 tsp cumin powder",
                "Salt to taste"
            ],
            "instructions": [
                "Heat butter in pan, add ginger-garlic paste",
                "Add tomato puree and cook until thick",
                "Add spices and cook for 5 minutes",
                "Add paneer cubes and cream",
                "Simmer for 10 minutes and serve hot"
            ],
            "tags": ["Indian", "Vegetarian", "Paneer", "Creamy", "North Indian"],
            "rating": 4.7,
            "author": "Chef Meera",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "5",
            "title": "Sambar",
            "description": "Traditional South Indian lentil-based vegetable stew",
            "image": "https://images.pexels.com/photos/5560788/pexels-photo-5560788.jpeg",
            "category": "Main Course",
            "difficulty": "Medium",
            "cookingTime": 40,
            "servings": 4,
            "ingredients": [
                "1 cup toor dal",
                "2 tbsp tamarind paste",
                "1 drumstick, cut into pieces",
                "1 small brinjal, cubed",
                "2 tomatoes, chopped",
                "2 tbsp sambar powder",
                "1 tsp mustard seeds",
                "Curry leaves",
                "2 tbsp oil"
            ],
            "instructions": [
                "Cook toor dal until soft and mushy",
                "Heat oil, add mustard seeds and curry leaves",
                "Add vegetables and sauté",
                "Add tamarind water and sambar powder",
                "Add cooked dal and simmer for 15 minutes"
            ],
            "tags": ["South Indian", "Tamil Nadu", "Vegetarian", "Lentils", "Traditional"],
            "rating": 4.8,
            "author": "Chef Raman",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "6",
            "title": "Palak Paneer",
            "description": "Creamy spinach curry with cottage cheese cubes",
            "image": "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
            "category": "Main Course",
            "difficulty": "Medium",
            "cookingTime": 35,
            "servings": 4,
            "ingredients": [
                "500g fresh spinach",
                "250g paneer, cubed",
                "2 onions, chopped",
                "4 cloves garlic",
                "1 inch ginger",
                "2 green chilies",
                "1 tsp garam masala",
                "2 tbsp cream",
                "2 tbsp oil"
            ],
            "instructions": [
                "Blanch spinach and make puree",
                "Heat oil, add cumin seeds",
                "Add onions and cook until golden",
                "Add spinach puree and spices",
                "Add paneer and cream, simmer"
            ],
            "tags": ["Indian", "Vegetarian", "Spinach", "Paneer", "Healthy"],
            "rating": 4.6,
            "author": "Chef Meera",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "7",
            "title": "Idli",
            "description": "Soft steamed rice cakes, a South Indian breakfast staple",
            "image": "https://images.pexels.com/photos/5560789/pexels-photo-5560789.jpeg",
            "category": "Breakfast",
            "difficulty": "Medium",
            "cookingTime": 25,
            "servings": 16,
            "ingredients": [
                "3 cups idli rice",
                "1 cup urad dal",
                "1/2 tsp fenugreek seeds",
                "1 tsp salt",
                "Water as needed"
            ],
            "instructions": [
                "Soak rice and urad dal separately for 4-6 hours",
                "Grind both to smooth paste",
                "Mix and ferment for 8-12 hours",
                "Pour into idli molds and steam for 12-15 minutes"
            ],
            "tags": ["South Indian", "Breakfast", "Steamed", "Healthy", "Vegetarian"],
            "rating": 4.7,
            "author": "Chef Kamala",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "8",
            "title": "Tandoori Chicken",
            "description": "Marinated chicken roasted in traditional tandoor oven",
            "image": "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
            "category": "Main Course",
            "difficulty": "Medium",
            "cookingTime": 90,
            "servings": 4,
            "ingredients": [
                "1 whole chicken, cut into pieces",
                "1 cup yogurt",
                "2 tbsp lemon juice",
                "2 tbsp ginger-garlic paste",
                "2 tsp tandoori masala",
                "1 tsp red chili powder",
                "2 tbsp mustard oil",
                "Salt to taste"
            ],
            "instructions": [
                "Make deep cuts in chicken pieces",
                "Mix yogurt with all spices",
                "Marinate chicken for at least 4 hours",
                "Roast in oven at 450°F for 25-30 minutes"
            ],
            "tags": ["Indian", "Chicken", "Tandoori", "Grilled", "Protein-rich"],
            "rating": 4.8,
            "author": "Chef Ashok",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "9",
            "title": "Chole",
            "description": "Spicy chickpea curry, perfect with bhature or rice",
            "image": "https://images.pexels.com/photos/5560827/pexels-photo-5560827.jpeg",
            "category": "Main Course",
            "difficulty": "Medium",
            "cookingTime": 60,
            "servings": 4,
            "ingredients": [
                "2 cups chickpeas, soaked overnight",
                "2 onions, chopped",
                "3 tomatoes, chopped",
                "1 tbsp ginger-garlic paste",
                "2 tsp chole masala",
                "1 tsp cumin powder",
                "1 tsp red chili powder",
                "3 tbsp oil"
            ],
            "instructions": [
                "Pressure cook chickpeas until tender",
                "Heat oil, add onions and cook until golden",
                "Add tomatoes and spices",
                "Add cooked chickpeas and simmer"
            ],
            "tags": ["Indian", "Vegetarian", "Protein-rich", "Spicy", "Punjabi"],
            "rating": 4.8,
            "author": "Chef Harpreet",
            "createdAt": datetime.now().isoformat()
        },
        {
            "id": "10",
            "title": "Vegetable Manchurian",
            "description": "Indo-Chinese crispy vegetable balls in tangy sauce",
            "image": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
            "category": "Main Course",
            "difficulty": "Medium",
            "cookingTime": 45,
            "servings": 4,
            "ingredients": [
                "2 cups mixed vegetables, chopped",
                "1/2 cup flour",
                "2 tbsp cornstarch",
                "3 tbsp soy sauce",
                "2 tbsp tomato ketchup",
                "1 tbsp chili sauce",
                "2 spring onions",
                "Oil for frying"
            ],
            "instructions": [
                "Mix vegetables with flour and spices",
                "Form balls and deep fry until golden",
                "Make sauce with soy sauce, ketchup, and chili sauce",
                "Toss fried balls in sauce and serve"
            ],
            "tags": ["Indo-Chinese", "Vegetarian", "Spicy", "Fried"],
            "rating": 4.5,
            "author": "Chef Wong",
            "createdAt": datetime.now().isoformat()
        }
    ]
    
    for recipe_data in sample_recipes:
        recipe_data["createdAt"] = datetime.fromisoformat(recipe_data["createdAt"].replace("Z", "+00:00"))
        recipe = Recipe(**recipe_data)
        recipes_db.append(recipe)

# Initialize sample data on startup
init_sample_data()

# API Routes
@app.get("/")
async def root():
    return {"message": "Recipe Search API is running!"}

@app.get("/recipes", response_model=List[Recipe])
async def get_recipes(
    search: Optional[str] = Query(None, description="Search term"),
    category: Optional[str] = Query("All Categories", description="Recipe category"),
    difficulty: Optional[str] = Query("All", description="Recipe difficulty"),
    maxTime: Optional[int] = Query(180, description="Maximum cooking time in minutes")
):
    """Get filtered recipes"""
    filters = RecipeFilter(
        search=search or "",
        category=category,
        difficulty=difficulty,
        maxTime=maxTime
    )
    
    filtered_recipes = filter_recipes(recipes_db, filters)
    return filtered_recipes

@app.get("/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: str):
    """Get a specific recipe by ID"""
    recipe = next((r for r in recipes_db if r.id == recipe_id), None)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@app.post("/recipes", response_model=Recipe)
async def create_recipe(recipe: Recipe):
    """Create a new recipe"""
    # Check if recipe with same ID exists
    if any(r.id == recipe.id for r in recipes_db):
        raise HTTPException(status_code=400, detail="Recipe with this ID already exists")
    
    recipe.createdAt = datetime.now()
    recipes_db.append(recipe)
    return recipe

@app.put("/recipes/{recipe_id}", response_model=Recipe)
async def update_recipe(recipe_id: str, recipe_update: Recipe):
    """Update an existing recipe"""
    recipe_index = next((i for i, r in enumerate(recipes_db) if r.id == recipe_id), None)
    if recipe_index is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    recipe_update.id = recipe_id  # Ensure ID doesn't change
    recipes_db[recipe_index] = recipe_update
    return recipe_update

@app.delete("/recipes/{recipe_id}")
async def delete_recipe(recipe_id: str):
    """Delete a recipe"""
    recipe_index = next((i for i, r in enumerate(recipes_db) if r.id == recipe_id), None)
    if recipe_index is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    deleted_recipe = recipes_db.pop(recipe_index)
    return {"message": f"Recipe '{deleted_recipe.title}' deleted successfully"}

@app.get("/search/suggestions", response_model=SearchSuggestion)
async def get_search_suggestions_endpoint(q: str = Query(..., description="Search query")):
    """Get search suggestions based on query"""
    suggestions = get_search_suggestions(q, recipes_db)
    return SearchSuggestion(suggestions=suggestions)

@app.get("/categories")
async def get_categories():
    """Get all available recipe categories"""
    categories = list(set([recipe.category for recipe in recipes_db]))
    categories.sort()
    return {"categories": ["All Categories"] + categories}

@app.get("/stats")
async def get_stats():
    """Get recipe statistics"""
    total_recipes = len(recipes_db)
    categories = {}
    difficulties = {}
    avg_rating = 0
    
    if total_recipes > 0:
        for recipe in recipes_db:
            categories[recipe.category] = categories.get(recipe.category, 0) + 1
            difficulties[recipe.difficulty] = difficulties.get(recipe.difficulty, 0) + 1
        
        avg_rating = sum(recipe.rating for recipe in recipes_db) / total_recipes
    
    return {
        "total_recipes": total_recipes,
        "categories": categories,
        "difficulties": difficulties,
        "average_rating": round(avg_rating, 2),
        "global_database_size": len(global_recipe_database)
    }

@app.post("/bulk-import")
async def bulk_import_recipes(recipes: List[Recipe]):
    """Bulk import recipes"""
    imported_count = 0
    errors = []
    
    for recipe in recipes:
        try:
            # Check if recipe already exists
            if not any(r.id == recipe.id for r in recipes_db):
                recipe.createdAt = datetime.now()
                recipes_db.append(recipe)
                imported_count += 1
            else:
                errors.append(f"Recipe with ID {recipe.id} already exists")
        except Exception as e:
            errors.append(f"Error importing recipe {recipe.title}: {str(e)}")
    
    return {
        "imported_count": imported_count,
        "total_submitted": len(recipes),
        "errors": errors
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
