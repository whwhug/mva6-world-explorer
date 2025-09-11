import React from 'react';
import Globe from '../components/Globe';
import Header from '../components/Header';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-subtle overflow-hidden">
      <Header />
      <Globe />
      
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>
    </div>
  );
};

export default Index;
