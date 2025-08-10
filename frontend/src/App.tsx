import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { Auth } from './components/Auth.tsx';

function App() {
  const [authed, setAuthed] = useState<boolean>(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setAuthed(!!token && !!user);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {authed ? (
        <Dashboard />
      ) : (
        <Auth onAuth={() => setAuthed(true)} />
      )}
    </div>
  );
}

export default App;