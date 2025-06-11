import { Recipe } from '../types/Recipe';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Truffle Mushroom Risotto',
    description: 'Creamy, luxurious risotto with wild mushrooms and truffle oil',
    image: 'https://images.pexels.com/photos/1630309/pexels-photo-1630309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Hard',
    cookingTime: 45,
    servings: 4,
    ingredients: [
      '1½ cups Arborio rice',
      '4 cups warm chicken stock',
      '1 lb mixed wild mushrooms',
      '1 medium onion, finely chopped',
      '3 cloves garlic, minced',
      '½ cup dry white wine',
      '¼ cup grated Parmesan',
      '2 tbsp truffle oil',
      '2 tbsp butter',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat the chicken stock in a saucepan and keep warm over low heat.',
      'In a large pan, sauté mushrooms until golden. Set aside.',
      'In the same pan, melt butter and cook onion until translucent.',
      'Add garlic and rice, stirring until rice is coated with butter.',
      'Pour in wine and stir until absorbed.',
      'Add warm stock one ladle at a time, stirring constantly.',
      'Continue until rice is creamy and al dente (about 20 minutes).',
      'Fold in mushrooms, Parmesan, and truffle oil.',
      'Season with salt and pepper, serve immediately.'
    ],
    tags: ['Italian', 'Vegetarian', 'Gourmet'],
    rating: 4.8,
    author: 'Maria Rossi',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Korean BBQ Tacos',
    description: 'Fusion tacos with marinated bulgogi beef and kimchi slaw',
    image: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Medium',
    cookingTime: 30,
    servings: 6,
    ingredients: [
      '1 lb thinly sliced ribeye',
      '¼ cup soy sauce',
      '2 tbsp brown sugar',
      '1 tbsp sesame oil',
      '1 Asian pear, grated',
      '12 corn tortillas',
      '2 cups kimchi, chopped',
      '1 cucumber, julienned',
      '¼ cup mayo',
      '2 green onions, sliced'
    ],
    instructions: [
      'Marinate beef in soy sauce, brown sugar, sesame oil, and pear for 2 hours.',
      'Mix kimchi with cucumber and a bit of mayo for the slaw.',
      'Heat a grill pan over high heat.',
      'Cook marinated beef for 2-3 minutes per side.',
      'Warm tortillas in a dry pan.',
      'Fill tortillas with beef and kimchi slaw.',
      'Garnish with green onions and serve.'
    ],
    tags: ['Korean', 'Fusion', 'Spicy'],
    rating: 4.6,
    author: 'Chef Kim',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate cakes with molten centers',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Dessert',
    difficulty: 'Medium',
    cookingTime: 25,
    servings: 4,
    ingredients: [
      '4 oz dark chocolate, chopped',
      '4 tbsp unsalted butter',
      '2 large eggs',
      '2 large egg yolks',
      '¼ cup granulated sugar',
      '2 tbsp all-purpose flour',
      'Butter and cocoa for ramekins',
      'Vanilla ice cream for serving'
    ],
    instructions: [
      'Preheat oven to 425°F. Butter and dust 4 ramekins with cocoa.',
      'Melt chocolate and butter in double boiler until smooth.',
      'Whisk eggs, egg yolks, and sugar until thick and pale.',
      'Fold melted chocolate into egg mixture.',
      'Gently fold in flour until just combined.',
      'Divide batter among ramekins.',
      'Bake for 12-14 minutes until edges are firm.',
      'Let cool for 1 minute, then invert onto plates.',
      'Serve immediately with vanilla ice cream.'
    ],
    tags: ['Chocolate', 'Dessert', 'Individual'],
    rating: 4.9,
    author: 'Pastry Chef Anna',
    createdAt: new Date('2024-01-25')
  },
  {
    id: '4',
    title: 'Mediterranean Quinoa Bowl',
    description: 'Healthy bowl with quinoa, fresh vegetables, and tahini dressing',
    image: 'https://images.pexels.com/photos/793785/pexels-photo-793785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Salad',
    difficulty: 'Easy',
    cookingTime: 20,
    servings: 2,
    ingredients: [
      '1 cup quinoa',
      '1 cucumber, diced',
      '1 cup cherry tomatoes, halved',
      '½ red onion, sliced',
      '½ cup kalamata olives',
      '¼ cup feta cheese, crumbled',
      '¼ cup tahini',
      '2 tbsp lemon juice',
      '1 tbsp olive oil',
      'Fresh parsley, chopped'
    ],
    instructions: [
      'Cook quinoa according to package directions. Let cool.',
      'Whisk tahini, lemon juice, and olive oil for dressing.',
      'Combine quinoa with cucumber, tomatoes, and onion.',
      'Top with olives and feta cheese.',
      'Drizzle with tahini dressing.',
      'Garnish with fresh parsley and serve.'
    ],
    tags: ['Healthy', 'Mediterranean', 'Vegetarian'],
    rating: 4.4,
    author: 'Wellness Chef',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '5',
    title: 'Spicy Thai Green Curry',
    description: 'Aromatic green curry with coconut milk and fresh herbs',
    image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Medium',
    cookingTime: 35,
    servings: 4,
    ingredients: [
      '2 tbsp green curry paste',
      '1 can coconut milk',
      '1 lb chicken thighs, sliced',
      '1 Thai eggplant, cubed',
      '1 bell pepper, sliced',
      '2 tbsp fish sauce',
      '1 tbsp palm sugar',
      'Thai basil leaves',
      '2 kaffir lime leaves',
      'Jasmine rice for serving'
    ],
    instructions: [
      'Heat 2 tbsp thick coconut milk in a wok over medium heat.',
      'Add curry paste and fry until fragrant.',
      'Add chicken and cook until no longer pink.',
      'Pour in remaining coconut milk and bring to simmer.',
      'Add eggplant, bell pepper, fish sauce, and palm sugar.',
      'Simmer for 15 minutes until vegetables are tender.',
      'Stir in basil and lime leaves.',
      'Serve over jasmine rice.'
    ],
    tags: ['Thai', 'Spicy', 'Coconut'],
    rating: 4.7,
    author: 'Chef Somchai',
    createdAt: new Date('2024-02-05')
  },
  {
    id: '6',
    title: 'Classic French Croissants',
    description: 'Buttery, flaky croissants made with traditional lamination technique',
    image: 'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Breakfast',
    difficulty: 'Hard',
    cookingTime: 180,
    servings: 8,
    ingredients: [
      '3 cups bread flour',
      '1 tbsp sugar',
      '1 tsp salt',
      '1 packet active dry yeast',
      '¾ cup warm milk',
      '1 cup cold butter',
      '1 egg, beaten (for wash)'
    ],
    instructions: [
      'Mix flour, sugar, salt, and yeast. Add warm milk to form dough.',
      'Knead until smooth, wrap, and refrigerate for 1 hour.',
      'Roll cold butter into 6x10 inch rectangle.',
      'Roll dough into 12x20 inch rectangle.',
      'Place butter on half of dough, fold over and seal edges.',
      'Perform 3 letter folds, chilling 30 minutes between each.',
      'Roll final dough and cut into triangles.',
      'Shape into croissants and proof for 2 hours.',
      'Brush with egg wash and bake at 400°F for 15-20 minutes.'
    ],
    tags: ['French', 'Pastry', 'Breakfast'],
    rating: 4.5,
    author: 'Boulanger Pierre',
    createdAt: new Date('2024-02-10')
  },
  {
    id: '7',
    title: 'Matar Paneer',
    description: 'Classic Indian curry with green peas and cottage cheese in rich tomato gravy',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Medium',
    cookingTime: 40,
    servings: 4,
    ingredients: [
      '200g paneer, cubed',
      '1 cup green peas',
      '2 large tomatoes, chopped',
      '1 large onion, chopped',
      '3 cloves garlic, minced',
      '1 inch ginger, minced',
      '2 tsp cumin seeds',
      '1 tsp coriander powder',
      '1 tsp garam masala',
      '½ tsp turmeric powder',
      '1 tsp red chili powder',
      '2 tbsp oil',
      'Salt to taste',
      'Fresh cilantro for garnish'
    ],
    instructions: [
      'Heat oil in a pan and lightly fry paneer cubes until golden. Set aside.',
      'In the same pan, add cumin seeds and let them splutter.',
      'Add onions and sauté until golden brown.',
      'Add ginger-garlic paste and cook for 2 minutes.',
      'Add tomatoes and cook until they break down completely.',
      'Add all spices and cook for 2-3 minutes.',
      'Add green peas and cook for 5 minutes.',
      'Add fried paneer and mix gently.',
      'Add water if needed and simmer for 10 minutes.',
      'Garnish with fresh cilantro and serve with rice or roti.'
    ],
    tags: ['Indian', 'Vegetarian', 'Curry', 'Paneer'],
    rating: 4.6,
    author: 'Chef Priya',
    createdAt: new Date('2024-02-12')
  },
  {
    id: '8',
    title: 'Butter Chicken',
    description: 'Creamy and rich Indian chicken curry in tomato-based sauce',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Medium',
    cookingTime: 50,
    servings: 4,
    ingredients: [
      '1 lb chicken breast, cubed',
      '½ cup plain yogurt',
      '1 tbsp lemon juice',
      '2 tsp garam masala',
      '1 tsp cumin powder',
      '1 can crushed tomatoes',
      '1 onion, chopped',
      '4 cloves garlic, minced',
      '1 inch ginger, minced',
      '½ cup heavy cream',
      '2 tbsp butter',
      '1 tsp paprika',
      'Salt and pepper to taste',
      'Basmati rice for serving'
    ],
    instructions: [
      'Marinate chicken in yogurt, lemon juice, and half the spices for 30 minutes.',
      'Cook marinated chicken in a pan until done. Set aside.',
      'In the same pan, melt butter and sauté onions until soft.',
      'Add garlic and ginger, cook for 2 minutes.',
      'Add crushed tomatoes and remaining spices.',
      'Simmer for 15 minutes until sauce thickens.',
      'Add cooked chicken back to the sauce.',
      'Stir in heavy cream and simmer for 5 minutes.',
      'Serve hot with basmati rice and naan.'
    ],
    tags: ['Indian', 'Chicken', 'Curry', 'Creamy'],
    rating: 4.8,
    author: 'Chef Raj',
    createdAt: new Date('2024-02-14')
  },
  {
    id: '9',
    title: 'Vegetable Manchurian',
    description: 'Indo-Chinese crispy vegetable balls in tangy sauce',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Medium',
    cookingTime: 45,
    servings: 4,
    ingredients: [
      '2 cups mixed vegetables (cabbage, carrot, beans), finely chopped',
      '½ cup all-purpose flour',
      '2 tbsp cornstarch',
      '1 tsp ginger-garlic paste',
      '2 green chilies, minced',
      '3 tbsp soy sauce',
      '2 tbsp tomato ketchup',
      '1 tbsp chili sauce',
      '1 tbsp vinegar',
      '1 tsp sugar',
      '2 spring onions, chopped',
      'Oil for deep frying',
      'Salt to taste'
    ],
    instructions: [
      'Mix chopped vegetables with flour, cornstarch, ginger-garlic paste, and salt.',
      'Add water gradually to form a thick batter.',
      'Heat oil and deep fry small balls of the mixture until golden.',
      'For sauce, heat 2 tbsp oil in a pan.',
      'Add ginger-garlic paste and green chilies, sauté briefly.',
      'Add soy sauce, ketchup, chili sauce, vinegar, and sugar.',
      'Add ½ cup water and bring to boil.',
      'Add fried vegetable balls and toss gently.',
      'Garnish with spring onions and serve hot.'
    ],
    tags: ['Indo-Chinese', 'Vegetarian', 'Spicy', 'Fried'],
    rating: 4.5,
    author: 'Chef Wong',
    createdAt: new Date('2024-02-16')
  },
  {
    id: '10',
    title: 'Chicken Manchurian',
    description: 'Crispy chicken pieces in spicy Indo-Chinese sauce',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Medium',
    cookingTime: 40,
    servings: 4,
    ingredients: [
      '1 lb chicken breast, cut into strips',
      '½ cup all-purpose flour',
      '2 tbsp cornstarch',
      '1 egg, beaten',
      '2 tsp ginger-garlic paste',
      '3 tbsp soy sauce',
      '2 tbsp tomato ketchup',
      '1 tbsp chili sauce',
      '1 tbsp vinegar',
      '1 tsp sugar',
      '2 spring onions, chopped',
      '1 bell pepper, sliced',
      'Oil for frying',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Marinate chicken with salt, pepper, and half the ginger-garlic paste.',
      'Mix flour, cornstarch, and beaten egg to make batter.',
      'Coat chicken pieces in batter and deep fry until golden.',
      'Heat 2 tbsp oil in a wok over high heat.',
      'Add remaining ginger-garlic paste and bell pepper.',
      'Add soy sauce, ketchup, chili sauce, vinegar, and sugar.',
      'Add fried chicken and toss to coat with sauce.',
      'Garnish with spring onions and serve immediately.'
    ],
    tags: ['Indo-Chinese', 'Chicken', 'Spicy', 'Fried'],
    rating: 4.7,
    author: 'Chef Li',
    createdAt: new Date('2024-02-18')
  },
  {
    id: '11',
    title: 'Chicken Biryani',
    description: 'Aromatic basmati rice layered with spiced chicken and saffron',
    image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Hard',
    cookingTime: 90,
    servings: 6,
    ingredients: [
      '2 cups basmati rice',
      '1 lb chicken, cut into pieces',
      '1 cup yogurt',
      '2 large onions, sliced',
      '4 cloves garlic, minced',
      '1 inch ginger, minced',
      '2 tsp biryani masala',
      '1 tsp red chili powder',
      '½ tsp turmeric',
      'Pinch of saffron',
      '¼ cup warm milk',
      '4 tbsp ghee',
      'Whole spices (bay leaves, cardamom, cinnamon)',
      'Fresh mint and cilantro',
      'Salt to taste'
    ],
    instructions: [
      'Soak rice for 30 minutes. Soak saffron in warm milk.',
      'Marinate chicken with yogurt, ginger-garlic paste, and spices for 1 hour.',
      'Deep fry onions until golden and crispy. Set aside.',
      'Cook marinated chicken until 70% done.',
      'Boil rice with whole spices until 70% cooked.',
      'Layer rice and chicken in a heavy-bottomed pot.',
      'Top with fried onions, saffron milk, mint, and cilantro.',
      'Cover with foil and lid, cook on high for 3 minutes.',
      'Reduce heat and cook for 45 minutes.',
      'Let it rest for 10 minutes before serving.'
    ],
    tags: ['Indian', 'Biryani', 'Chicken', 'Aromatic'],
    rating: 4.9,
    author: 'Chef Hyderabadi',
    createdAt: new Date('2024-02-20')
  },
  {
    id: '12',
    title: 'Pasta Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, and pancetta',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Main Course',
    difficulty: 'Medium',
    cookingTime: 25,
    servings: 4,
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale, diced',
      '4 large eggs',
      '1 cup Pecorino Romano, grated',
      '3 cloves garlic, minced',
      '2 tbsp olive oil',
      'Black pepper, freshly ground',
      'Salt for pasta water'
    ],
    instructions: [
      'Bring a large pot of salted water to boil for pasta.',
      'Cook spaghetti according to package directions until al dente.',
      'Meanwhile, heat olive oil and cook pancetta until crispy.',
      'Add garlic and cook for 1 minute.',
      'In a bowl, whisk eggs with cheese and black pepper.',
      'Reserve 1 cup pasta water before draining.',
      'Add hot pasta to pancetta pan.',
      'Remove from heat and quickly mix in egg mixture.',
      'Add pasta water gradually to create creamy sauce.',
      'Serve immediately with extra cheese and pepper.'
    ],
    tags: ['Italian', 'Pasta', 'Creamy', 'Classic'],
    rating: 4.8,
    author: 'Chef Romano',
    createdAt: new Date('2024-02-22')
  }
];

export const categories = [
  'All Categories',
  'Breakfast',
  'Main Course',
  'Dessert',
  'Salad',
  'Appetizer',
  'Soup',
  'Beverage'
];

// Comprehensive recipe database for intelligent suggestions
export const globalRecipeDatabase = [
  // Indian Dishes
  'Matar Paneer', 'Butter Chicken', 'Chicken Biryani', 'Vegetable Biryani', 'Dal Makhani',
  'Palak Paneer', 'Chicken Tikka Masala', 'Aloo Gobi', 'Rajma', 'Chole Bhature',
  'Samosa', 'Dosa', 'Idli', 'Vada Pav', 'Pav Bhaji', 'Tandoori Chicken',
  
  // Indo-Chinese
  'Vegetable Manchurian', 'Chicken Manchurian', 'Hakka Noodles', 'Fried Rice',
  'Chili Chicken', 'Gobi Manchurian', 'Spring Rolls', 'Momos',
  
  // Italian
  'Pasta Carbonara', 'Margherita Pizza', 'Lasagna', 'Risotto', 'Spaghetti Bolognese',
  'Fettuccine Alfredo', 'Penne Arrabbiata', 'Tiramisu', 'Bruschetta',
  
  // Chinese
  'Sweet and Sour Chicken', 'Kung Pao Chicken', 'Mapo Tofu', 'Peking Duck',
  'Hot Pot', 'Dim Sum', 'Chow Mein', 'General Tso Chicken',
  
  // Thai
  'Pad Thai', 'Green Curry', 'Tom Yum Soup', 'Massaman Curry', 'Som Tam',
  'Thai Basil Chicken', 'Mango Sticky Rice',
  
  // Mexican
  'Tacos', 'Burritos', 'Quesadillas', 'Enchiladas', 'Guacamole', 'Nachos',
  'Fajitas', 'Churros', 'Tres Leches Cake',
  
  // American
  'Hamburger', 'Hot Dog', 'Mac and Cheese', 'BBQ Ribs', 'Fried Chicken',
  'Caesar Salad', 'Clam Chowder', 'Apple Pie', 'Cheesecake',
  
  // Japanese
  'Sushi', 'Ramen', 'Tempura', 'Teriyaki Chicken', 'Miso Soup', 'Yakitori',
  'Udon', 'Katsu Curry', 'Mochi',
  
  // Mediterranean
  'Greek Salad', 'Hummus', 'Falafel', 'Shawarma', 'Baklava', 'Moussaka',
  'Tzatziki', 'Dolmas', 'Spanakopita',
  
  // French
  'Croissant', 'French Toast', 'Coq au Vin', 'Ratatouille', 'Crème Brûlée',
  'Bouillabaisse', 'Quiche Lorraine', 'Macarons',
  
  // Desserts
  'Chocolate Cake', 'Ice Cream', 'Cookies', 'Brownies', 'Donuts', 'Pancakes',
  'Waffles', 'Milkshake', 'Smoothie', 'Fruit Salad'
];