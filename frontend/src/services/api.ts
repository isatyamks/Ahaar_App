const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

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
  private userId = 'default_user'; // Will be sourced from auth when available
  private token: string | null = null;

  constructor() {
    // Initialize from localStorage if present
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u?.id) this.userId = u.id;
      }
      if (storedToken) this.token = storedToken;
    } catch {}
  }

  async uploadMeal(imageFile: File, mealTime?: string, date?: string): Promise<MealUploadResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', this.userId);
    if (!this.token) {
      // Legacy/dev password fallback when not authenticated
      formData.append('password', 'isatyamks810');
    }
    
    if (mealTime) {
      formData.append('meal_time', mealTime);
    }
    
    if (date) {
      formData.append('date', date);
    }

    const headers: Record<string, string> = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const response = await fetch(`${API_BASE_URL}/upload-meal`, {
      method: 'POST',
      body: formData,
      headers,
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

  // -------- Auth --------
  async signup(email: string, password: string, name?: string) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    this.setAuth(data.token, data.user.id);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    this.setAuth(data.token, data.user.id);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userId = 'default_user';
  }

  setAuth(token: string, userId: string) {
    this.token = token;
    this.userId = userId;
  }
}

export const apiService = new ApiService();