
import React from 'react';
import { GenerationConfig, ModelType, AspectRatio, ImageSize } from '../types';

interface SidebarProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onGenerate, isGenerating }) => {
  return (
    <aside className="w-full md:w-80 lg:w-96 glass border-r border-gray-800 overflow-y-auto p-6 flex flex-col gap-8 shrink-0">
      {/* Prompt Input */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Image Prompt</label>
        <div className="relative">
          <textarea
            value={config.prompt}
            onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
            placeholder="Describe your vision... (e.g., 'A cyberpunk city with neon lights and floating vehicles at sunset')"
            className="w-full h-40 bg-gray-900/50 border border-gray-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none placeholder:text-gray-600"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
             <button 
                onClick={() => setConfig({...config, prompt: ''})}
                className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
                title="Clear"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
             </button>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Engine Quality</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900 border border-gray-800 rounded-xl">
          <button
            onClick={() => setConfig({ ...config, model: ModelType.FLASH })}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              config.model === ModelType.FLASH 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Standard (Fast)
          </button>
          <button
            onClick={() => setConfig({ ...config, model: ModelType.PRO })}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              config.model === ModelType.PRO 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Pro (Ultra HQ)
          </button>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Aspect Ratio</label>
        <div className="grid grid-cols-5 gap-2">
          {(Object.entries(AspectRatio) as [string, AspectRatio][]).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setConfig({ ...config, aspectRatio: value })}
              className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border transition-all ${
                config.aspectRatio === value 
                ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'
              }`}
            >
              <div className={`w-4 border-2 rounded-sm border-current ${
                value === AspectRatio.SQ ? 'h-4' : 
                value === AspectRatio.LANDSCAPE ? 'h-3 w-4' :
                value === AspectRatio.WIDE ? 'h-2 w-4' :
                value === AspectRatio.PORTRAIT ? 'h-4 w-3' : 'h-4 w-2'
              }`}></div>
              <span className="text-[10px] font-bold">{value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Size (Visible only for Pro) */}
      {config.model === ModelType.PRO && (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resolution</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.values(ImageSize)).map((size) => (
              <button
                key={size}
                onClick={() => setConfig({ ...config, imageSize: size })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  config.imageSize === size 
                  ? 'bg-purple-600/10 border-purple-500 text-purple-400' 
                  : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !config.prompt.trim()}
        className={`mt-auto w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-xl transition-all ${
          isGenerating || !config.prompt.trim()
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-600/20'
        }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Dreaming...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Generate Masterpiece</span>
          </>
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
