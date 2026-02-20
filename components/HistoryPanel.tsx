
import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryPanelProps {
  history: GeneratedImage[];
  onSelect: (img: GeneratedImage) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed lg:relative inset-y-0 right-0 w-80 bg-[#030712] border-l border-gray-800 flex flex-col z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold font-outfit">Recents</h2>
          <span className="text-xs text-gray-500">{history.length} assets</span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-gray-800 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Your generation history will appear here.</p>
            </div>
          ) : (
            history.map((img) => (
              <button
                key={img.id}
                onClick={() => onSelect(img)}
                className="group relative w-full aspect-square rounded-xl overflow-hidden glass border-gray-800 hover:border-blue-500/50 transition-all active:scale-[0.98]"
              >
                <img 
                  src={img.url} 
                  alt={img.prompt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-left">
                  <p className="text-[10px] text-white line-clamp-2 leading-tight">
                    {img.prompt}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-gray-800">
             <button 
                onClick={() => {
                  if (confirm("Are you sure you want to clear your history?")) {
                    localStorage.removeItem('dreamcanvas_history');
                    window.location.reload();
                  }
                }}
                className="w-full py-2 text-xs font-bold text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear History
             </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default HistoryPanel;
