import React from 'react';
import { Apple, Github, Twitter, Mail } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }>= ({ children }) => {
  return (
    <div className="bg-white text-gray-900 font-body min-h-screen flex flex-col">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b z-20 font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Apple className="h-6 w-6" style={{ color: 'var(--ah-primary)' }} />
            <span className="font-semibold" style={{ color: 'var(--ah-secondary)' }}>Ahaar</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/roadmap" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>Roadmap</a>
            <a href="/changelog" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>Changelog</a>
            <a href="/status" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>Status</a>
            <a href="/privacy" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>Privacy</a>
            <a href="/terms" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>Terms</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t text-sm" style={{ color: 'var(--ah-text-muted)', background: 'var(--ah-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
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
                <a href="mailto:contact@example.com" aria-label="Email" className="hover:opacity-80" style={{ color: 'var(--ah-secondary)' }}>
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Product</div>
              <ul className="mt-3 space-y-2">
                <li><a href="/" className="hover:underline" style={{ color: 'inherit' }}>Overview</a></li>
                <li><a href="/pricing" className="hover:underline" style={{ color: 'inherit' }}>Pricing</a></li>
                <li><a href="/roadmap" className="hover:underline" style={{ color: 'inherit' }}>Roadmap</a></li>
                <li><a href="/changelog" className="hover:underline" style={{ color: 'inherit' }}>Changelog</a></li>
                <li><a href="/status" className="hover:underline" style={{ color: 'inherit' }}>Status</a></li>
              </ul>
            </div>
            <div>
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Developers</div>
              <ul className="mt-3 space-y-2">
                <li><a href="/#api" className="hover:underline" style={{ color: 'inherit' }}>API</a></li>
                <li><a href="/#use-cases" className="hover:underline" style={{ color: 'inherit' }}>Use Cases</a></li>
                <li><a href="/guides" className="hover:underline" style={{ color: 'inherit' }}>Guides</a></li>
                <li><a href="/sdks" className="hover:underline" style={{ color: 'inherit' }}>SDKs</a></li>
                <li><a href="/examples" className="hover:underline" style={{ color: 'inherit' }}>Examples</a></li>
              </ul>
            </div>
            <div>
              <div className="font-medium" style={{ color: 'var(--ah-secondary)' }}>Company</div>
              <ul className="mt-3 space-y-2">
                <li><a href="/about" className="hover:underline" style={{ color: 'inherit' }}>About</a></li>
                <li><a href="/blog" className="hover:underline" style={{ color: 'inherit' }}>Blog</a></li>
                <li><a href="/careers" className="hover:underline" style={{ color: 'inherit' }}>Careers</a></li>
                <li><a href="/contact" className="hover:underline" style={{ color: 'inherit' }}>Contact</a></li>
              </ul>
            </div>
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
    </div>
  );
};

export default Layout;
