import React from 'react';
import { Globe } from 'lucide-react';
import mvaLogo from '../assets/mva-logo.png';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-6">
      <div className="flex items-start justify-between">
        {/* Logo and branding */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-elegant">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
              <img src={mvaLogo} alt="Minerva Virtual Academy" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Minerva Virtual Academy</h1>
              <p className="text-sm text-muted-foreground">Online Sixth Form</p>
            </div>
          </div>
        </div>

        {/* Event info */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-elegant text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Open Event</span>
          </div>
          <p className="text-xs text-muted-foreground">Discover Our Global Community</p>
        </div>
      </div>
    </header>
  );
};

export default Header;