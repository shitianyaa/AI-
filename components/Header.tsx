import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">ProHeadshot AI</h1>
              <p className="text-xs text-brand-600 font-medium hidden sm:block">由 Gemini 2.5 驱动</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI 增强</span>
             </div>
             <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors">
               文档
             </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;