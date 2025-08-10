import React, { useEffect, useState } from 'react';
import { TrendingUp, Apple, Droplets, Heart, Shield, Eye, Bone, Plus, Wifi, WifiOff } from 'lucide-react';
import NutritionCard from './NutritionCard';
import TimePeriodSelector from './TimePeriodSelector';
import DateSelector from './DateSelector';
import DateRangeDisplay from './DateRangeDisplay';
import MealsList from './MealsList';
import NutritionChart from './NutritionChart';
import MealUpload from './MealUpload';
import { useNutritionData } from '../hooks/useNutritionData';
import { apiService } from '../services/api';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | undefined>();
  const [showMealUpload, setShowMealUpload] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  const PASSWORD = 'isatyamks810';
  const PASSWORD_KEY = 'meal_upload_authenticated';

  const { data: currentData, loading, isOnline, refetch } = useNutritionData(
    selectedPeriod,
    selectedDate,
    dateRange
  );

  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Here you would typically fetch data for the selected date
    console.log('Selected date:', date);
  };

  const handleDateRangeSelect = (range: { start: Date; end: Date }) => {
    setDateRange(range);
    // Here you would typically fetch data for the selected date range
    console.log('Selected date range:', range);
  };

  const handleMealUploadSuccess = (meal: any) => {
    console.log('Meal uploaded successfully:', meal);
    setShowMealUpload(false);
    refetch(); // Refresh the nutrition data
  };

  const handleAddMealClick = () => {
    // If logged in (JWT present), bypass legacy password gate
    const hasToken = !!localStorage.getItem('token');
    if (hasToken) {
      setShowMealUpload(true);
      return;
    }
    if (localStorage.getItem(PASSWORD_KEY) === 'true') {
      setShowMealUpload(true);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      localStorage.setItem(PASSWORD_KEY, 'true');
      setShowPasswordPrompt(false);
      setShowMealUpload(true);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password.');
    }
  };

  // legacy password modal cleanup happens on close

  const handleTopLogout = () => {
    apiService.logout();
    window.location.reload();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Apple className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-medium text-gray-900">Ahaar</h1>
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" aria-label="Connected to backend" />
                ) : (
                  <WifiOff className="h-4 w-4 text-gray-400" aria-label="Using demo data" />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddMealClick}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Meal</span>
              </button>
              <TimePeriodSelector 
                selected={selectedPeriod} 
                onSelect={setSelectedPeriod}
              />
              <DateSelector
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                selectedPeriod={selectedPeriod}
                dateRange={dateRange}
                onDateRangeSelect={handleDateRangeSelect}
              />
              <div className="hidden md:block h-6 w-px bg-gray-200" />
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold">
                    {(user?.name || user?.email || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                      {user?.name || user?.email || 'Guest'}
                    </span>
                    {user?.email && user?.name && (
                      <span className="text-xs text-gray-500 truncate max-w-[140px]">{user.email}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleTopLogout}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Display */}
        <DateRangeDisplay
          selectedDate={selectedDate}
          selectedPeriod={selectedPeriod}
          dateRange={dateRange}
        />

        {/* Overview Cards */}
        {loading && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-center">Loading nutrition data...</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <NutritionCard
            title="Calories"
            value={currentData.calories}
            unit="kcal"
            target={2000}
            icon={<TrendingUp className="h-5 w-5" />}
            color="blue"
          />
          <NutritionCard
            title="Protein"
            value={currentData.protein}
            unit="g"
            target={150}
            icon={<Heart className="h-5 w-5" />}
            color="red"
          />
          <NutritionCard
            title="Carbs"
            value={currentData.carbs}
            unit="g"
            target={250}
            icon={<Apple className="h-5 w-5" />}
            color="green"
          />
          <NutritionCard
            title="Fat"
            value={currentData.fat}
            unit="g"
            target={65}
            icon={<Droplets className="h-5 w-5" />}
            color="yellow"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nutrition Breakdown</h3>
            <NutritionChart data={currentData} />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Calories</span>
                <span className="text-sm text-gray-600">{currentData.calories}/2000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((currentData.calories / 2000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Protein</span>
                <span className="text-sm text-gray-600">{currentData.protein}/150g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((currentData.protein / 150) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Carbs</span>
                <span className="text-sm text-gray-600">{currentData.carbs}/250g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((currentData.carbs / 250) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Nutrition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Vitamins</h3>
            </div>
            <div className="space-y-3">
              {currentData.vitamins.map((vitamin, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{vitamin.name}</span>
                  <span className="text-sm text-gray-600">{vitamin.amount}{vitamin.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bone className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-medium text-gray-900">Minerals</h3>
            </div>
            <div className="space-y-3">
              {currentData.minerals.map((mineral, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{mineral.name}</span>
                  <span className="text-sm text-gray-600">{mineral.amount}{mineral.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Other Nutrients</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Fiber</span>
                <span className="text-sm text-gray-600">{currentData.fiber}g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sugar</span>
                <span className="text-sm text-gray-600">{currentData.sugar}g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sodium</span>
                <span className="text-sm text-gray-600">{currentData.sodium}mg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Cholesterol</span>
                <span className="text-sm text-gray-600">{currentData.cholesterol}mg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Meals Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Meals</h3>
          <MealsList meals={currentData.meals} />
        </div>
      </main>

      {/* Meal Upload Modal */}
      {showMealUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <MealUpload
            onUploadSuccess={handleMealUploadSuccess}
            onClose={() => setShowMealUpload(false)}
          />
        </div>
      )}
  {/* Password Prompt Modal (legacy fallback) */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Password</h3>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Password"
              autoFocus
            />
            {passwordError && <div className="text-red-600 text-sm mb-2">{passwordError}</div>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => { setShowPasswordPrompt(false); setPasswordInput(''); setPasswordError(''); }}
                className="px-3 py-1 bg-gray-200 rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-green-600 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;