// Audited: Strict React Hook rules enforced. Hooks called at top level.
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const Header = () => {
  // Hook called at the top level
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/40 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm" style={{background: 'rgba(255,255,255,0.7)'}}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="text-cyan-600" size={28} />
            <span className="text-xl font-bold text-gray-900">Product Cipher</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button
              asChild
              variant={isActive('/') ? 'default' : 'ghost'}
              className={isActive('/') ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'text-gray-700 hover:text-gray-900'}
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-gray-900"
              onClick={() => {
                const featuresSection = document.getElementById('core-features');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Features
            </Button>
            <Button
              asChild
              variant={isActive('/visualizer') ? 'default' : 'ghost'}
              className={isActive('/visualizer') ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'text-gray-700 hover:text-gray-900'}
            >
              <Link to="/visualizer">Visualizer</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;