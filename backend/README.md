# Recipe Search Backend API

A FastAPI-based backend server for real-time recipe search and management.

## Features

- **Real-time Search**: Fast text-based recipe search with intelligent ranking
- **Smart Suggestions**: Auto-complete suggestions based on recipe database
- **Advanced Filtering**: Filter by category, difficulty, cooking time
- **RESTful API**: Full CRUD operations for recipes
- **CORS Support**: Ready for frontend integration
- **Fuzzy Matching**: Finds recipes even with typos
- **Bulk Import**: Import multiple recipes at once
- **Statistics**: Recipe analytics and insights

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Server

```bash
# Development mode (auto-reload)
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access the API

- **API Server**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## API Endpoints

### Recipe Management

- `GET /recipes` - Get filtered recipes
  - Query params: `search`, `category`, `difficulty`, `maxTime`
- `GET /recipes/{id}` - Get specific recipe
- `POST /recipes` - Create new recipe
- `PUT /recipes/{id}` - Update recipe
- `DELETE /recipes/{id}` - Delete recipe

### Search & Discovery

- `GET /search/suggestions?q={query}` - Get search suggestions
- `GET /categories` - Get all recipe categories
- `GET /stats` - Get recipe statistics

### Bulk Operations

- `POST /bulk-import` - Import multiple recipes

## Example Usage

### Search Recipes
```bash
curl "http://localhost:8000/recipes?search=chicken&category=Main Course&difficulty=Medium"
```

### Get Suggestions
```bash
curl "http://localhost:8000/search/suggestions?q=dosa"
```

### Create Recipe
```bash
curl -X POST "http://localhost:8000/recipes" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-recipe",
    "title": "Chicken Biryani",
    "description": "Fragrant rice dish with chicken",
    "category": "Main Course",
    "difficulty": "Hard",
    "cookingTime": 90,
    "servings": 6,
    "ingredients": ["chicken", "rice", "spices"],
    "instructions": ["Cook chicken", "Prepare rice", "Layer and cook"],
    "tags": ["Indian", "Rice", "Spicy"],
    "rating": 4.5,
    "author": "Chef Ahmed"
  }'
```

## Integration with Frontend

The backend is configured with CORS to work with your React frontend running on ports 3000 and 5173.

### Environment Variables

Create a `.env` file for configuration:

```env
DATABASE_URL=sqlite:///./recipes.db
SECRET_KEY=your-secret-key-here
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Database Integration

For production, replace the in-memory storage with a proper database:

1. **SQLite** (included in requirements)
2. **PostgreSQL** (add `psycopg2-binary`)
3. **MySQL** (add `pymysql`)

## Search Features

### Intelligent Ranking
- Exact title matches get highest priority
- Tag matches get medium priority
- Ingredient/description matches get lower priority
- Results sorted by relevance and rating

### Fuzzy Search
- Handles typos and partial matches
- Uses similarity scoring (>50% threshold)
- Includes global recipe database for suggestions

### Real-time Suggestions
- Auto-complete as you type
- Combines current recipes + global database
- Maximum 8 suggestions for optimal UX

## Performance

- **FastAPI**: High-performance async framework
- **In-memory search**: Sub-millisecond response times
- **Efficient filtering**: Multiple criteria without performance penalty
- **Batch operations**: Bulk import/export support

## Production Deployment

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest api_client.py -v
```
