import React from 'react';

import mvaLogo from '../assets/mva-logo.png';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-6">
      <div className="flex items-start justify-between">
        {/* Logo and branding */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-elegant">
          <div className="text-left">
            <div className="w-full mb-3">
              <img src={mvaLogo} alt="Minerva Virtual Academy" className="h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Minerva Virtual Academy</h1>
              <p className="text-sm text-muted-foreground">A Sixth Form Like No Other</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;