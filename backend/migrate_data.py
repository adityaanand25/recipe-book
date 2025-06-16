import asyncio
import httpx
import json
from datetime import datetime
from pathlib import Path

# Sample recipes data (from your frontend)
SAMPLE_RECIPES = [
    {
        "id": "1",
        "title": "Truffle Mushroom Risotto",
        "description": "Creamy, luxurious risotto with wild mushrooms and truffle oil",
        "image": "https://images.pexels.com/photos/1630309/pexels-photo-1630309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "category": "Main Course",
        "difficulty": "Hard",
        "cookingTime": 45,
        "servings": 4,
        "ingredients": [
            "1½ cups Arborio rice",
            "4 cups warm chicken stock",
            "1 lb mixed wild mushrooms",
            "1 medium onion, finely chopped",
            "3 cloves garlic, minced",
            "½ cup dry white wine",
            "¼ cup grated Parmesan",
            "2 tbsp truffle oil",
            "2 tbsp butter",
            "Salt and pepper to taste"
        ],
        "instructions": [
            "Heat the chicken stock in a saucepan and keep warm over low heat.",
            "In a large pan, sauté mushrooms until golden. Set aside.",
            "In the same pan, melt butter and cook onion until translucent.",
            "Add garlic and rice, stirring until rice is coated with butter.",
            "Pour in wine and stir until absorbed.",
            "Add warm stock one ladle at a time, stirring constantly.",
            "Continue until rice is creamy and al dente (about 20 minutes).",
            "Fold in mushrooms, Parmesan, and truffle oil.",
            "Season with salt and pepper, serve immediately."
        ],
        "tags": ["Italian", "Vegetarian", "Gourmet"],
        "rating": 4.8,
        "author": "Maria Rossi",
        "createdAt": "2024-01-15T00:00:00Z"
    },
    {
        "id": "2",
        "title": "Sambar",
        "description": "Traditional South Indian lentil-based vegetable stew with tamarind",
        "image": "https://images.pexels.com/photos/5560788/pexels-photo-5560788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "category": "Main Course",
        "difficulty": "Medium",
        "cookingTime": 40,
        "servings": 4,
        "ingredients": [
            "1 cup toor dal (pigeon peas)",
            "2 tbsp tamarind paste",
            "1 drumstick, cut into pieces",
            "1 small brinjal, cubed",
            "½ cup pumpkin, cubed",
            "10 okra pieces",
            "2 tomatoes, chopped",
            "2 tbsp sambar powder",
            "1 tsp turmeric",
            "1 tsp mustard seeds",
            "1 tsp cumin seeds",
            "4-5 curry leaves",
            "2 dried red chilies",
            "2 tbsp oil",
            "Salt to taste"
        ],
        "instructions": [
            "Pressure cook toor dal with turmeric until soft and mushy.",
            "Extract tamarind juice and set aside.",
            "Heat oil, add mustard seeds, cumin seeds, curry leaves, and red chilies.",
            "Add all vegetables and sauté for 5 minutes.",
            "Add tamarind water and bring to boil.",
            "Add sambar powder and cook for 10 minutes.",
            "Add cooked dal and simmer for 15 minutes.",
            "Garnish with cilantro and serve with rice or idli."
        ],
        "tags": ["South Indian", "Tamil Nadu", "Vegetarian", "Lentils", "Traditional"],
        "rating": 4.8,
        "author": "Chef Raman",
        "createdAt": "2024-03-09T00:00:00Z"
    },
    {
        "id": "3",
        "title": "Butter Chicken",
        "description": "Creamy and rich North Indian chicken curry with tomatoes and butter",
        "image": "https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "category": "Main Course",
        "difficulty": "Medium",
        "cookingTime": 45,
        "servings": 4,
        "ingredients": [
            "1 kg boneless chicken, cubed",
            "1 cup tomato puree",
            "½ cup heavy cream",
            "2 tbsp butter",
            "1 large onion, chopped",
            "3 cloves garlic, minced",
            "1 inch ginger, minced",
            "1 tbsp garam masala",
            "1 tsp red chili powder",
            "1 tsp cumin powder",
            "½ tsp turmeric",
            "Salt to taste",
            "Fresh cilantro for garnish"
        ],
        "instructions": [
            "Marinate chicken with yogurt, ginger-garlic paste, and spices for 30 minutes.",
            "Cook marinated chicken in a pan until tender.",
            "In the same pan, melt butter and sauté onions until golden.",
            "Add tomato puree and cook until oil separates.",
            "Add cooked chicken and simmer for 10 minutes.",
            "Stir in cream and garam masala.",
            "Garnish with cilantro and serve with naan or rice."
        ],
        "tags": ["Indian", "Non-Vegetarian", "Creamy", "Popular", "North Indian"],
        "rating": 4.9,
        "author": "Chef Rajesh",
        "createdAt": "2024-02-20T00:00:00Z"
    },
    {
        "id": "4",
        "title": "Masala Dosa",
        "description": "Crispy South Indian crepe filled with spiced potato curry",
        "image": "https://images.pexels.com/photos/5560788/pexels-photo-5560788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "category": "Breakfast",
        "difficulty": "Hard",
        "cookingTime": 45,
        "servings": 6,
        "ingredients": [
            "3 cups dosa batter (fermented)",
            "4 large potatoes, boiled",
            "2 onions, chopped",
            "2 green chilies, chopped",
            "1 tsp mustard seeds",
            "1 tsp cumin seeds",
            "10 curry leaves",
            "½ tsp turmeric",
            "1 tsp ginger, minced",
            "3 tbsp oil",
            "Salt to taste"
        ],
        "instructions": [
            "Mash boiled potatoes coarsely.",
            "Heat oil, add mustard seeds, cumin seeds, curry leaves.",
            "Add onions, green chilies, and ginger. Sauté until soft.",
            "Add turmeric and mashed potatoes. Mix well.",
            "Heat dosa pan and spread batter thinly.",
            "Place potato filling on one side of dosa.",
            "Fold and serve hot with sambar and coconut chutney."
        ],
        "tags": ["South Indian", "Breakfast", "Fermented", "Crispy", "Popular"],
        "rating": 4.9,
        "author": "Chef Krishnan",
        "createdAt": "2024-03-11T00:00:00Z"
    },
    {
        "id": "5",
        "title": "Chicken Biryani",
        "description": "Fragrant basmati rice layered with spiced chicken and aromatic herbs",
        "image": "https://images.pexels.com/photos/5560525/pexels-photo-5560525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "category": "Main Course",
        "difficulty": "Hard",
        "cookingTime": 90,
        "servings": 6,
        "ingredients": [
            "500g basmati rice",
            "1 kg chicken, cut into pieces",
            "1 cup yogurt",
            "2 large onions, sliced and fried",
            "2 tbsp ginger-garlic paste",
            "1 tsp red chili powder",
            "½ tsp turmeric",
            "1 tbsp biryani masala",
            "4-5 green cardamom",
            "2 bay leaves",
            "1 inch cinnamon stick",
            "Saffron soaked in milk",
            "Mint and cilantro leaves",
            "4 tbsp ghee",
            "Salt to taste"
        ],
        "instructions": [
            "Marinate chicken with yogurt, ginger-garlic paste, and spices for 2 hours.",
            "Cook marinated chicken until 70% done.",
            "Boil rice with whole spices until 70% cooked.",
            "Layer rice and chicken alternately in a heavy-bottomed pot.",
            "Sprinkle fried onions, mint, cilantro, and saffron milk.",
            "Cover and cook on high heat for 3 minutes, then on low heat for 45 minutes.",
            "Let it rest for 10 minutes before serving."
        ],
        "tags": ["Indian", "Non-Vegetarian", "Rice", "Festive", "Aromatic"],
        "rating": 4.9,
        "author": "Chef Ahmed",
        "createdAt": "2024-03-01T00:00:00Z"
    }
]

async def migrate_recipes_to_backend(base_url: str = "http://localhost:8000"):
    """Migrate sample recipes to the backend API"""
    
    async with httpx.AsyncClient() as client:
        print(f"🚀 Starting recipe migration to {base_url}")
        
        # Test if server is running
        try:
            response = await client.get(f"{base_url}/")
            print(f"✅ Server is running: {response.json()['message']}")
        except Exception as e:
            print(f"❌ Error connecting to server: {e}")
            print("Make sure the FastAPI server is running on port 8000")
            return
        
        # Bulk import recipes
        try:
            print(f"\n📦 Importing {len(SAMPLE_RECIPES)} recipes...")
            response = await client.post(f"{base_url}/bulk-import", json=SAMPLE_RECIPES)
            response.raise_for_status()
            
            result = response.json()
            print(f"✅ Successfully imported {result['imported_count']} recipes")
            
            if result['errors']:
                print(f"⚠️  Errors encountered:")
                for error in result['errors']:
                    print(f"   - {error}")
        
        except Exception as e:
            print(f"❌ Error during bulk import: {e}")
            
            # Try individual imports as fallback
            print("\n🔄 Trying individual imports...")
            success_count = 0
            
            for recipe in SAMPLE_RECIPES:
                try:
                    response = await client.post(f"{base_url}/recipes", json=recipe)
                    response.raise_for_status()
                    success_count += 1
                    print(f"✅ Imported: {recipe['title']}")
                except Exception as e:
                    print(f"❌ Failed to import {recipe['title']}: {e}")
            
            print(f"\n📊 Individual import results: {success_count}/{len(SAMPLE_RECIPES)} successful")
        
        # Test search functionality
        print("\n🔍 Testing search functionality...")
        try:
            # Test basic search
            response = await client.get(f"{base_url}/recipes?search=chicken")
            chicken_recipes = response.json()
            print(f"✅ Found {len(chicken_recipes)} chicken recipes")
            
            # Test suggestions
            response = await client.get(f"{base_url}/search/suggestions?q=dosa")
            suggestions = response.json()
            print(f"✅ Found {len(suggestions['suggestions'])} suggestions for 'dosa': {suggestions['suggestions']}")
            
            # Test categories
            response = await client.get(f"{base_url}/categories")
            categories = response.json()
            print(f"✅ Available categories: {categories['categories']}")
            
            # Test stats
            response = await client.get(f"{base_url}/stats")
            stats = response.json()
            print(f"✅ Recipe stats: {stats}")
            
        except Exception as e:
            print(f"❌ Error testing search: {e}")
        
        print("\n🎉 Migration completed!")
        print("\n📖 Next steps:")
        print("1. Your FastAPI server is running at http://localhost:8000")
        print("2. View API docs at http://localhost:8000/docs")
        print("3. Update your React frontend to use the backend API")
        print("4. Test real-time search functionality")

if __name__ == "__main__":
    asyncio.run(migrate_recipes_to_backend())
