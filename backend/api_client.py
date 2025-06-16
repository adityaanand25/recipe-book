import asyncio
import httpx
from typing import List, Dict, Any

class RecipeAPIClient:
    """Client for interacting with the Recipe API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client = httpx.AsyncClient()
    
    async def search_recipes(self, search: str = "", category: str = "All Categories", 
                           difficulty: str = "All", max_time: int = 180) -> List[Dict[Any, Any]]:
        """Search for recipes with filters"""
        params = {
            "search": search,
            "category": category,
            "difficulty": difficulty,
            "maxTime": max_time
        }
        
        response = await self.client.get(f"{self.base_url}/recipes", params=params)
        response.raise_for_status()
        return response.json()
    
    async def get_recipe(self, recipe_id: str) -> Dict[Any, Any]:
        """Get a specific recipe by ID"""
        response = await self.client.get(f"{self.base_url}/recipes/{recipe_id}")
        response.raise_for_status()
        return response.json()
    
    async def get_search_suggestions(self, query: str) -> List[str]:
        """Get search suggestions"""
        params = {"q": query}
        response = await self.client.get(f"{self.base_url}/search/suggestions", params=params)
        response.raise_for_status()
        return response.json()["suggestions"]
    
    async def get_categories(self) -> List[str]:
        """Get all available categories"""
        response = await self.client.get(f"{self.base_url}/categories")
        response.raise_for_status()
        return response.json()["categories"]
    
    async def get_stats(self) -> Dict[Any, Any]:
        """Get recipe statistics"""
        response = await self.client.get(f"{self.base_url}/stats")
        response.raise_for_status()
        return response.json()
    
    async def create_recipe(self, recipe_data: Dict[Any, Any]) -> Dict[Any, Any]:
        """Create a new recipe"""
        response = await self.client.post(f"{self.base_url}/recipes", json=recipe_data)
        response.raise_for_status()
        return response.json()
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Example usage
async def main():
    client = RecipeAPIClient()
    
    try:
        # Search for recipes
        print("Searching for 'chicken' recipes...")
        recipes = await client.search_recipes(search="chicken")
        print(f"Found {len(recipes)} recipes")
        
        # Get search suggestions
        print("\nGetting suggestions for 'dosa'...")
        suggestions = await client.get_search_suggestions("dosa")
        print(f"Suggestions: {suggestions}")
        
        # Get categories
        print("\nGetting categories...")
        categories = await client.get_categories()
        print(f"Categories: {categories}")
        
        # Get stats
        print("\nGetting stats...")
        stats = await client.get_stats()
        print(f"Stats: {stats}")
        
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(main())
