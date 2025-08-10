import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Apple, Shield, Activity, Sparkles, Code2, Lock, ArrowRight, Server, Image as ImageIcon, Camera, BarChart3, Quote, CheckCircle2, Github, Twitter, Mail, ChevronDown } from 'lucide-react';
import { Auth } from './Auth';
import CodeBlock from './ui/CodeBlock';

interface Props {
  onAuth: () => void;
}

const LandingPage: React.FC<Props> = ({ onAuth }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const ENV_URL = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  const API_BASE = useMemo(() => ENV_URL || 'https://ahaar-app.onrender.com/api', [ENV_URL]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Smooth scroll & scrollspy
  const sections = ['features','use-cases','api','pricing','faq','contact','security'] as const;
  const [active, setActive] = useState<string>('features');
  const observers = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const opts: IntersectionObserverInit = { root: null, rootMargin: '0px 0px -70% 0px', threshold: [0, 0.2, 0.6, 1] };
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, opts);
    observers.current = io;
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Back to top visibility
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const faqs = useMemo(() => ([
    {
      q: 'Is my data secure?',
      a: 'We use JWT auth and store media in MongoDB/GridFS. Only you can access your data.'
    },
    {
      q: 'What are API rate limits?',
      a: 'During beta we enforce fair-use limits; contact us for higher limits.'
    },
    {
      q: 'Which image formats are supported?',
      a: 'JPEG and PNG are fully supported. Keep files reasonably sized for faster analysis.'
    },
    {
      q: 'Can I self-host the backend?',
      a: 'Yes. It runs on ASGI (Uvicorn). See README for local setup or deploy to Render.'
    }
  ]), []);

  return (
    <div className="bg-white text-gray-900 font-body">
      {/* Nav */}
  <header className="sticky top-0 bg-white/80 backdrop-blur border-b z-20 font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Apple className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
            <span className="font-semibold" style={{ color: 'var(--ah-secondary)' }}>Ahaar</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {[
              { id: 'features', label: 'Features' },
              { id: 'use-cases', label: 'Use Cases' },
              { id: 'api', label: 'API' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'faq', label: 'FAQ' },
              { id: 'contact', label: 'Contact' }
            ].map(link => (
              <a key={link.id} href={`#${link.id}`} aria-current={active === link.id ? 'page' : undefined} className={`hover:opacity-80 ${active === link.id ? 'font-medium' : ''}`} style={{ color: 'var(--ah-secondary)' }}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="btn btn-outline" style={{ color: 'var(--ah-secondary)', borderColor: '#e5e7eb' }}>Sign in</button>
            <button onClick={() => { setAuthMode('signup'); setShowAuth(true); }} className="btn btn-primary flex items-center gap-1">
              Launch Web App <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero (split) */}
  <section className="font-body" style={{ background: 'linear-gradient(90deg, #ffffff 0%, #ffffff 50%, rgba(26,115,232,0.08) 50%, rgba(52,168,83,0.08) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight" style={{ color: 'var(--ah-secondary)' }}>Nutrition Analysis & REST API for Meal Images</h1>
            <p className="mt-4 text-lg" style={{ color: 'var(--ah-text-muted)' }}>Ingest meal images, extract nutrition, and query daily/weekly aggregates via a documented REST API.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => { setAuthMode('signup'); setShowAuth(true); }} className="btn btn-primary">Get Started</button>
              <a href="#api" className="btn btn-outline" style={{ color: 'var(--ah-secondary)', borderColor: '#e5e7eb' }}>For Developers</a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm" style={{ color: 'var(--ah-text-muted)' }}>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" style={{ color: 'var(--ah-primary)' }} /> JWT Auth</div>
              <div className="flex items-center gap-2"><Server className="h-4 w-4" style={{ color: 'var(--ah-primary)' }} /> ASGI (Uvicorn)</div>
              <div className="flex items-center gap-2"><Code2 className="h-4 w-4" style={{ color: 'var(--ah-primary)' }} /> REST API & Aggregations</div>
            </div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium mb-3" style={{ color: 'var(--ah-secondary)' }}>Capabilities</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg" style={{ background: 'var(--ah-bg-soft)' }}>
                <div className="font-medium">Per-meal fields</div>
                <ul className="list-disc list-inside" style={{ color: 'var(--ah-text-muted)' }}>
                  <li>Macros & micros</li>
                  <li>Computed indices (GI/GL, ORAC)</li>
                  <li>Fats breakdown</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--ah-bg-soft)' }}>
                <div className="font-medium">Aggregations</div>
                <ul className="list-disc list-inside" style={{ color: 'var(--ah-text-muted)' }}>
                  <li>Daily/weekly totals</li>
                  <li>Calories & protein trend</li>
                  <li>Progress summaries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features (Consumers) */}
  <section id="features" className="py-20 border-t font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-8" style={{ color: 'var(--ah-secondary)' }}>Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl bg-white">
              <ImageIcon className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-3 font-medium">Smart meal analysis</div>
              <p className="text-sm" style={{ color: 'var(--ah-text-muted)' }}>Upload a photo to detect foods and compute detailed nutrients automatically.</p>
            </div>
            <div className="p-6 border rounded-xl bg-white">
              <Activity className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-3 font-medium">Advanced health insights</div>
              <p className="text-sm" style={{ color: 'var(--ah-text-muted)' }}>GI/GL, ORAC, fats profile, allergens, energy equivalence, footprint and more.</p>
            </div>
            <div className="p-6 border rounded-xl bg-white">
              <Sparkles className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-3 font-medium">Trends and charts</div>
              <p className="text-sm" style={{ color: 'var(--ah-text-muted)' }}>See calories and protein across recent meals with sparklines and progress bars.</p>
            </div>
            <div className="p-6 border rounded-xl bg-white">
              <BarChart3 className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-3 font-medium">Insightful reports</div>
              <p className="text-sm" style={{ color: 'var(--ah-text-muted)' }}>Daily, weekly, and monthly views to help you stay on track.</p>
            </div>
            <div className="p-6 border rounded-xl bg-white">
              <Lock className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-3 font-medium">Secure authentication</div>
              <p className="text-sm" style={{ color: 'var(--ah-text-muted)' }}>JWT-based signup/login with per-user meals and images stored via MongoDB+GridFS.</p>
            </div>
            <div className="p-6 border rounded-xl bg-white">
              <Server className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-3 font-medium">Reliable backend</div>
              <p className="text-sm" style={{ color: 'var(--ah-text-muted)' }}>ASGI Flask on Uvicorn. CORS configured for web clients. Health check baked in.</p>
            </div>
            <div className="p-6 border rounded-xl bg-white">
              <Code2 className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-3 font-medium">Developer-friendly API</div>
              <p className="text-sm" style={{ color: 'var(--ah-text-muted)' }}>Use our REST API to upload meals, fetch nutrition, and render images in your app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 border-t font-body" style={{ background: 'var(--ah-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-8" style={{ color: 'var(--ah-secondary)' }}>Use Cases</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="card p-6">
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Individuals</div>
              <p className="mt-2" style={{ color: 'var(--ah-text-muted)' }}>Track meals effortlessly, get advanced insights (GI/GL, fats, ORAC), and follow actionable tips.</p>
            </div>
            <div className="p-6 bg-white border rounded-xl">
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Developers</div>
              <p className="mt-2" style={{ color: 'var(--ah-text-muted)' }}>Integrate meal uploads and nutrition analytics into apps using our REST endpoints.</p>
            </div>
            <div className="p-6 bg-white border rounded-xl">
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Coaches & Clinics</div>
              <p className="mt-2" style={{ color: 'var(--ah-text-muted)' }}>Review client trends, share reports, and build workflows with secure data access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Preview (Placeholder) */}
  <section className="py-20 border-t font-body scroll-mt-24" style={{ background: 'var(--ah-bg-soft)' }} id="demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-4" style={{ color: 'var(--ah-secondary)' }}>Live Demo Preview</h2>
          <p className="text-gray-600 mb-6">See how scanning a meal instantly reveals its nutrition breakdown.</p>
          <div className="card p-0 overflow-hidden">
            <div className="w-full" style={{ aspectRatio: '16 / 9', background: 'var(--ah-bg-soft)' }}>
              {/* Replace with <video> or <img loading="lazy"> when asset is ready */}
              <div className="h-full w-full flex items-center justify-center gap-3 text-sm text-gray-600">
                <Camera className="h-10 w-10" style={{ color: 'var(--ah-primary)' }} />
                <span>Demo video/GIF coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer API Section */}
      <section id="api" className="py-20 border-t" style={{ background: 'var(--ah-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-2" style={{ color: 'var(--ah-secondary)' }}>Integrate Ahaar into Your Apps</h2>
          <p className="mb-6" style={{ color: 'var(--ah-text-muted)' }}>Power your application with our food recognition and nutrition API. Base URL: <span className="font-code text-gray-900">{API_BASE}</span></p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="font-medium mb-2">Auth</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>POST /auth/signup — returns JWT</li>
                <li>POST /auth/login — returns JWT</li>
              </ul>
              <CodeBlock language="bash">{`curl -s -X POST ${API_BASE}/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'`}</CodeBlock>
            </div>
            <div className="card p-6">
              <div className="font-medium mb-2">Upload a Meal (image)</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>POST /upload-meal (multipart form-data)</li>
                <li>Headers: Authorization: Bearer &lt;token&gt; (optional legacy password)</li>
              </ul>
              <CodeBlock language="bash">{`curl -s -X POST ${API_BASE}/upload-meal \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/meal.jpg" -F "user_id=<your_user_id>"`}</CodeBlock>
            </div>
            <div className="card p-6">
              <div className="font-medium mb-2">Get Nutrition</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>GET /nutrition/{`{user_id}`}/{`{period}`}</li>
                <li>Query: date or start_date/end_date</li>
              </ul>
              <CodeBlock language="bash">{`curl -s "${API_BASE}/nutrition/<user_id>/daily?date=2025-08-10"`}</CodeBlock>
            </div>
            <div className="card p-6">
              <div className="font-medium mb-2">Meals & Images</div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>GET /meals/{`{user_id}`}</li>
                <li>GET /meal-image/{`{meal_id}`}</li>
              </ul>
              <CodeBlock language="bash">{`curl -L -o meal.jpg "${API_BASE}/meal-image/<meal_id>"`}</CodeBlock>
            </div>
          </div>

          <div className="mt-6 card p-6 text-sm prose-like" style={{ color: 'var(--ah-secondary)' }}>
            <div className="font-medium mb-2">Quick JS fetch</div>
            <CodeBlock language="javascript">{`const res = await fetch('${API_BASE}/nutrition/<user_id>/daily');
const data = await res.json();`}</CodeBlock>
            <div className="mt-4">
              <button className="btn btn-primary" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>Get API Key</button>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works */}
  <section className="py-16 border-t font-body scroll-mt-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-8" style={{ color: 'var(--ah-secondary)' }}>How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="card p-6">
              <Camera className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-2 font-medium">Capture</div>
              <p className="text-gray-600">Upload or take a photo.</p>
            </div>
            <div className="card p-6">
              <Sparkles className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-2 font-medium">Analyze</div>
              <p className="text-gray-600">AI detects food & calculates nutrition.</p>
            </div>
            <div className="card p-6">
              <CheckCircle2 className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
              <div className="mt-2 font-medium">Act</div>
              <p className="text-gray-600">Get recommendations or integrate via API.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section id="security" className="py-20 border-t font-body" style={{ background: 'var(--ah-bg-soft)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-4" style={{ color: 'var(--ah-secondary)' }}>Security & Privacy</h2>
          <p className="text-gray-700 mb-6">We design Ahaar with security and developer ergonomics in mind.</p>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="p-6 bg-white border rounded-xl">
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Authentication</div>
              <ul className="list-disc list-inside mt-2" style={{ color: 'var(--ah-text-muted)' }}>
                <li>JWT-based signup/login with short-lived tokens</li>
                <li>Bearer token required for protected endpoints</li>
                <li>Optional httpOnly cookies recommended for web apps</li>
              </ul>
            </div>
            <div className="p-6 bg-white border rounded-xl">
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Data & Storage</div>
              <ul className="list-disc list-inside mt-2" style={{ color: 'var(--ah-text-muted)' }}>
                <li>Meals and images stored in MongoDB Atlas + GridFS</li>
                <li>CORS restricted to trusted origins (Render/Vercel/local)</li>
                <li>Health endpoint for uptime monitoring</li>
              </ul>
            </div>
            <div className="p-6 bg-white border rounded-xl">
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Privacy</div>
              <ul className="list-disc list-inside mt-2" style={{ color: 'var(--ah-text-muted)' }}>
                <li>No public sharing of user data by default</li>
                <li>PII minimized; images accessed only by owner</li>
                <li>Dev-only legacy password path discouraged in production</li>
              </ul>
            </div>
            <div className="p-6 bg-white border rounded-xl">
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Best Practices</div>
              <ul className="list-disc list-inside mt-2" style={{ color: 'var(--ah-text-muted)' }}>
                <li>Store secrets in environment variables</li>
                <li>Rotate tokens; validate payload sizes and file types</li>
                <li>Use HTTPS in production</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Limits */}
  <section id="pricing" className="py-20 border-t font-body scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-display font-bold mb-8" style={{ color: 'var(--ah-secondary)' }}>Pricing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="font-medium">For Consumers</div>
        <ul className="list-disc list-inside text-sm mt-2" style={{ color: 'var(--ah-text-muted)' }}>
                <li>Free: basic tracking</li>
                <li>Premium: custom plans and analytics</li>
              </ul>
            </div>
            <div className="card p-6">
              <div className="font-medium">For Developers</div>
        <ul className="list-disc list-inside text-sm mt-2" style={{ color: 'var(--ah-text-muted)' }}>
                <li>Free Tier: X requests/month</li>
                <li>Paid Tier: higher limits, priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Case Studies */}
  <section className="py-20 border-t font-body" style={{ background: 'var(--ah-bg-soft)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-8" style={{ color: 'var(--ah-secondary)' }}>What People Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
    <div className="card p-6 text-sm">
              <Quote className="h-5 w-5 mb-2" style={{ color: 'var(--ah-primary)' }} />
              "I finally understand my meals. The insights are spot on."
              <div className="mt-3" style={{ color: 'var(--ah-text-muted)' }}>— User</div>
            </div>
    <div className="card p-6 text-sm">
              <Quote className="h-5 w-5 mb-2" style={{ color: 'var(--ah-primary)' }} />
              "Integration took minutes. The API is clean and fast."
              <div className="mt-3" style={{ color: 'var(--ah-text-muted)' }}>— Developer</div>
            </div>
    <div className="card p-6 text-sm">
              <Quote className="h-5 w-5 mb-2" style={{ color: 'var(--ah-primary)' }} />
              "Reports helped me stay consistent and improve my diet."
              <div className="mt-3" style={{ color: 'var(--ah-text-muted)' }}>— User</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
  <section id="faq" className="py-20 border-t font-body scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-6" style={{ color: 'var(--ah-secondary)' }}>FAQ</h2>
          <div className="mx-auto max-w-3xl">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="border-b">
                  <button
                    className="w-full flex items-center justify-between py-4 text-left hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ah-primary)] focus-visible:ring-offset-1 rounded-md"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span className="font-medium" style={{ color: 'var(--ah-secondary)' }}>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--ah-primary)' }}
                      aria-hidden="true"
                    />
                  </button>
                  {open && (
                    <div id={`faq-panel-${i}`} className="pb-4 text-sm" style={{ color: 'var(--ah-text-muted)' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
  <section className="py-24 border-t font-body" style={{ background: 'linear-gradient(90deg, rgba(0,168,107,0.08) 0%, rgba(11,94,60,0.08) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--ah-secondary)' }}>Start Eating Smarter — Or Start Building Smarter.</h2>
          <div className="mt-6 flex justify-center gap-3">
            <button className="btn btn-primary" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>Get Started</button>
            <a href="#api" className="btn btn-outline" style={{ color: 'var(--ah-secondary)', borderColor: '#e5e7eb' }}>Get API Access</a>
          </div>
        </div>
      </section>

      {/* Contact */}
  <section id="contact" className="py-16 border-t scroll-mt-24" style={{ background: 'var(--ah-bg-soft)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold mb-2" style={{ color: 'var(--ah-secondary)' }}>Contact</h2>
          <p style={{ color: 'var(--ah-text-muted)' }}>Have questions or need access? Open an issue on <a className="underline link" href="https://github.com/isatyamks/Ahaar_App/issues">GitHub</a>.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t text-sm" style={{ color: 'var(--ah-text-muted)', background: 'var(--ah-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5" style={{ color: 'var(--ah-primary)' }} />
                <span className="font-semibold" style={{ color: 'var(--ah-secondary)' }}>Ahaar</span>
              </div>
              <p className="mt-3">AI nutrition tracking and developer-friendly APIs.</p>
              <div className="mt-4 flex items-center gap-3">
                <a href="https://github.com/isatyamks/Ahaar_App" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Twitter" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#contact" aria-label="Email" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Product</div>
              <ul className="mt-3 space-y-2">
                <li><a href="#features" className="hover:underline" style={{ color: 'inherit' }}>Overview</a></li>
                <li><a href="#pricing" className="hover:underline" style={{ color: 'inherit' }}>Pricing</a></li>
                <li><a href="/roadmap" className="hover:underline" style={{ color: 'inherit' }}>Roadmap</a></li>
                <li><a href="/changelog" className="hover:underline" style={{ color: 'inherit' }}>Changelog</a></li>
                <li><a href="/status" className="hover:underline" style={{ color: 'inherit' }}>Status</a></li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Developers</div>
              <ul className="mt-3 space-y-2">
                <li><a href="#api" className="hover:underline" style={{ color: 'inherit' }}>API</a></li>
                <li><a href="#api" className="hover:underline" style={{ color: 'inherit' }}>Docs</a></li>
                <li><a href="/guides" className="hover:underline" style={{ color: 'inherit' }}>Guides</a></li>
                <li><a href="/sdks" className="hover:underline" style={{ color: 'inherit' }}>SDKs</a></li>
                <li><a href="/examples" className="hover:underline" style={{ color: 'inherit' }}>Examples</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Company</div>
              <ul className="mt-3 space-y-2">
                <li><a href="/about" className="hover:underline" style={{ color: 'inherit' }}>About</a></li>
                <li><a href="/blog" className="hover:underline" style={{ color: 'inherit' }}>Blog</a></li>
                <li><a href="/careers" className="hover:underline" style={{ color: 'inherit' }}>Careers</a></li>
                <li><a href="#contact" className="hover:underline" style={{ color: 'inherit' }}>Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Legal</div>
              <ul className="mt-3 space-y-2">
                <li><a href="/privacy" className="hover:underline" style={{ color: 'inherit' }}>Privacy</a></li>
                <li><a href="/terms" className="hover:underline" style={{ color: 'inherit' }}>Terms</a></li>
                <li><a href="/security" className="hover:underline" style={{ color: 'inherit' }}>Security</a></li>
                <li><a href="/cookies" className="hover:underline" style={{ color: 'inherit' }}>Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex flex-col md:flex-row items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} Ahaar</span>
            <div className="flex items-center gap-4">
              <a href="/terms" className="hover:underline" style={{ color: 'inherit' }}>Terms</a>
              <a href="/privacy" className="hover:underline" style={{ color: 'inherit' }}>Privacy</a>
              <a href="/sitemap.xml" className="hover:underline" style={{ color: 'inherit' }}>Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 btn btn-primary shadow-lg"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {showAuth && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuth(false); }}
        >
          <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-md">
            <Auth initialMode={authMode} onAuth={() => { setShowAuth(false); onAuth(); }} />
            <div className="mt-2 text-center">
              <button className="text-sm text-gray-600 underline" onClick={() => setShowAuth(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* lock scroll and esc */}
      <ModalSideEffects open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default LandingPage;

// Helper component: manages body scroll lock and ESC-to-close when modal is open
const ModalSideEffects: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);
  return null;
};
