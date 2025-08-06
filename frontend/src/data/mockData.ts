// Mock data representing what would come from Gemini API analysis
export const mockNutritionData = {
  daily: {
    calories: 1650,
    protein: 125,
    carbs: 180,
    fat: 58,
    fiber: 25,
    sugar: 45,
    sodium: 1200,
    cholesterol: 180,
    vitamins: [
      { name: 'Vitamin A', amount: 800, unit: 'μg' },
      { name: 'Vitamin C', amount: 75, unit: 'mg' },
      { name: 'Vitamin D', amount: 15, unit: 'μg' },
      { name: 'Vitamin E', amount: 12, unit: 'mg' },
      { name: 'Vitamin K', amount: 90, unit: 'μg' },
      { name: 'Folate', amount: 300, unit: 'μg' },
      { name: 'B12', amount: 2.5, unit: 'μg' },
    ],
    minerals: [
      { name: 'Calcium', amount: 1000, unit: 'mg' },
      { name: 'Iron', amount: 15, unit: 'mg' },
      { name: 'Magnesium', amount: 350, unit: 'mg' },
      { name: 'Phosphorus', amount: 800, unit: 'mg' },
      { name: 'Potassium', amount: 3500, unit: 'mg' },
      { name: 'Zinc', amount: 10, unit: 'mg' },
    ],
    meals: [
      {
        id: '1',
        name: 'Grilled Chicken Salad',
        time: '12:30 PM',
        calories: 420,
        imageUrl: '/meal1.jpg',
        nutrition: {
          macronutrients: {
            protein: 35,
            carbs: 10,
            fat: 12,
            fiber: 6,
            sugar: 4
          }
        }
      },
      {
        id: '2',
        name: 'Oatmeal with Berries',
        time: '8:00 AM',
        calories: 340,
        imageUrl: '/meal2.jpg',
        nutrition: {
          macronutrients: {
            protein: 8,
            carbs: 60,
            fat: 7,
            fiber: 8,
            sugar: 18
          }
        }
      },
      {
        id: '3',
        name: 'Salmon with Quinoa',
        time: '7:00 PM',
        calories: 560,
        imageUrl: '/meal3.jpg',
        nutrition: {
          macronutrients: {
            protein: 40,
            carbs: 45,
            fat: 28,
            fiber: 5,
            sugar: 2
          }
        }
      },
      {
        id: '4',
        name: 'Greek Yogurt Parfait',
        time: '3:30 PM',
        calories: 220,
        imageUrl: '/meal4.jpg',
        nutrition: {
          macronutrients: {
            protein: 12,
            carbs: 30,
            fat: 2,
            fiber: 2,
            sugar: 12
          }
        }
      },
    ]
  },
  weekly: {
    calories: 11550,
    protein: 875,
    carbs: 1260,
    fat: 406,
    fiber: 175,
    sugar: 315,
    sodium: 8400,
    cholesterol: 1260,
    vitamins: [
      { name: 'Vitamin A', amount: 5600, unit: 'μg' },
      { name: 'Vitamin C', amount: 525, unit: 'mg' },
      { name: 'Vitamin D', amount: 105, unit: 'μg' },
      { name: 'Vitamin E', amount: 84, unit: 'mg' },
      { name: 'Vitamin K', amount: 630, unit: 'μg' },
      { name: 'Folate', amount: 2100, unit: 'μg' },
      { name: 'B12', amount: 17.5, unit: 'μg' },
    ],
    minerals: [
      { name: 'Calcium', amount: 7000, unit: 'mg' },
      { name: 'Iron', amount: 105, unit: 'mg' },
      { name: 'Magnesium', amount: 2450, unit: 'mg' },
      { name: 'Phosphorus', amount: 5600, unit: 'mg' },
      { name: 'Potassium', amount: 24500, unit: 'mg' },
      { name: 'Zinc', amount: 70, unit: 'mg' },
    ],
    meals: [
      {
        id: '1',
        name: 'Weekly Average - Lunch',
        time: 'Daily',
        calories: 2310,
        imageUrl: '/weekly1.jpg'
      },
      {
        id: '2',
        name: 'Weekly Average - Breakfast',
        time: 'Daily',
        calories: 1890,
        imageUrl: '/weekly2.jpg'
      },
      {
        id: '3',
        name: 'Weekly Average - Dinner',
        time: 'Daily',
        calories: 2940,
        imageUrl: '/weekly3.jpg'
      },
    ]
  },
  monthly: {
    calories: 49500,
    protein: 3750,
    carbs: 5400,
    fat: 1740,
    fiber: 750,
    sugar: 1350,
    sodium: 36000,
    cholesterol: 5400,
    vitamins: [
      { name: 'Vitamin A', amount: 24000, unit: 'μg' },
      { name: 'Vitamin C', amount: 2250, unit: 'mg' },
      { name: 'Vitamin D', amount: 450, unit: 'μg' },
      { name: 'Vitamin E', amount: 360, unit: 'mg' },
      { name: 'Vitamin K', amount: 2700, unit: 'μg' },
      { name: 'Folate', amount: 9000, unit: 'μg' },
      { name: 'B12', amount: 75, unit: 'μg' },
    ],
    minerals: [
      { name: 'Calcium', amount: 30000, unit: 'mg' },
      { name: 'Iron', amount: 450, unit: 'mg' },
      { name: 'Magnesium', amount: 10500, unit: 'mg' },
      { name: 'Phosphorus', amount: 24000, unit: 'mg' },
      { name: 'Potassium', amount: 105000, unit: 'mg' },
      { name: 'Zinc', amount: 300, unit: 'mg' },
    ],
    meals: [
      {
        id: '1',
        name: 'Monthly Average - All Meals',
        time: 'Daily Average',
        calories: 1650,
        imageUrl: '/monthly1.jpg'
      },
      {
        id: '2',
        name: 'Top Nutrient Dense Meals',
        time: 'Weekly',
        calories: 2340,
        imageUrl: '/monthly2.jpg'
      },
    ]
  }
};