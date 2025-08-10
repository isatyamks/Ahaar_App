const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  vitamins: Array<{ name: string; amount: number; unit: string }>;
  minerals: Array<{ name: string; amount: number; unit: string }>;
  meals: Array<{
    id: string;
    name: string;
    time: string;
    calories: number;
    imageUrl: string;
  }>;
}

export interface MealUploadResponse {
  success: boolean;
  meal: {
    id: string;
    name: string;
    time: string;
    date: string;
    calories: number;
    nutrition: any;
  };
  nutrition: any;
}

class ApiService {
  private userId = 'default_user'; // In a real app, this would come from authentication

  async uploadMeal(imageFile: File, mealTime?: string, date?: string): Promise<MealUploadResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', this.userId);
    formData.append('password', 'isatyamks810'); // Add password for backend authentication
    
    if (mealTime) {
      formData.append('meal_time', mealTime);
    }
    
    if (date) {
      formData.append('date', date);
    }

    const response = await fetch(`${API_BASE_URL}/upload-meal`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getNutritionData(
    period: 'daily' | 'weekly' | 'monthly',
    date?: string,
    startDate?: string,
    endDate?: string
  ): Promise<NutritionData> {
    const params = new URLSearchParams();
    
    if (date) {
      params.append('date', date);
    }
    
    if (startDate && endDate) {
      params.append('start_date', startDate);
      params.append('end_date', endDate);
    }

    const response = await fetch(
      `${API_BASE_URL}/nutrition/${this.userId}/${period}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch nutrition data: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserMeals(date?: string) {
    const params = new URLSearchParams();
    
    if (date) {
      params.append('date', date);
    }

    const response = await fetch(
      `${API_BASE_URL}/meals/${this.userId}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.statusText}`);
    }

    return response.json();
  }

  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }
}

export const apiService = new ApiService();