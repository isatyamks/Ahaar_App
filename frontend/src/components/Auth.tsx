import React, { useState } from 'react';
import { apiService } from '../services/api';

interface Props {
  onAuth: () => void;
  initialMode?: 'login' | 'signup';
}

export const Auth: React.FC<Props> = ({ onAuth, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        await apiService.signup(email, password, name);
      } else {
        await apiService.login(email, password);
      }
      onAuth();
    } catch (err: any) {
      setError(err?.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === 'login' ? (
            <button className="text-blue-600" onClick={() => setMode('signup')}>Need an account? Sign up</button>
          ) : (
            <button className="text-blue-600" onClick={() => setMode('login')}>Have an account? Login</button>
          )}
        </div>
      </div>
    </div>
  );
};
