import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import SimplePage from './pages/SimplePage';

function App() {
  const [authed, setAuthed] = useState<boolean>(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setAuthed(!!token && !!user);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={authed ? <Dashboard /> : <LandingPage onAuth={() => setAuthed(true)} />} />
          <Route path="/roadmap" element={<SimplePage title="Roadmap" description="What we're building next." />} />
          <Route path="/changelog" element={<SimplePage title="Changelog" description="Latest updates and improvements." />} />
          <Route path="/status" element={<SimplePage title="Status" description="Uptime and incidents." />} />
          <Route path="/privacy" element={<SimplePage title="Privacy Policy" />} />
          <Route path="/terms" element={<SimplePage title="Terms of Service" />} />
          <Route path="/cookies" element={<SimplePage title="Cookies" />} />
          <Route path="/about" element={<SimplePage title="About" />} />
          <Route path="/blog" element={<SimplePage title="Blog" />} />
          <Route path="/careers" element={<SimplePage title="Careers" />} />
          <Route path="/guides" element={<SimplePage title="Guides" />} />
          <Route path="/sdks" element={<SimplePage title="SDKs" />} />
          <Route path="/examples" element={<SimplePage title="Examples" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;