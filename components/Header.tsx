
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-gray-800 glass z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold font-outfit tracking-tight">
          DreamCanvas <span className="gradient-text">AI</span>
        </h1>
      </div>
      
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
        <a href="#" className="hover:text-white transition-colors">Studio</a>
        <a href="#" className="hover:text-white transition-colors">Showcase</a>
        <a href="#" className="hover:text-white transition-colors">Guides</a>
        <div className="h-4 w-px bg-gray-800"></div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-300">Gemini Online</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
