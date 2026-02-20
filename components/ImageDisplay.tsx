
import React, { useState } from 'react';
import { GeneratedImage, AspectRatio } from '../types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isGenerating }) => {
  const [loadingMessages] = useState([
    "Mixing colors and digital paints...",
    "Understanding your vision...",
    "Applying professional lighting...",
    "Rendering high-quality details...",
    "Optimizing textures and shadows...",
    "Finalizing pixels for perfection...",
    "Generating artistic inspiration..."
  ]);
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, loadingMessages.length]);

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `dreamcanvas-${Date.now()}.png`;
    link.click();
  };

  const getAspectClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case AspectRatio.SQ: return 'aspect-square';
      case AspectRatio.LANDSCAPE: return 'aspect-[4/3]';
      case AspectRatio.WIDE: return 'aspect-video';
      case AspectRatio.PORTRAIT: return 'aspect-[3/4]';
      case AspectRatio.TALL: return 'aspect-[9/16]';
      default: return 'aspect-square';
    }
  };

  if (!image && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="w-24 h-24 mb-8 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse"></div>
          <svg className="w-12 h-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 font-outfit">Ready to create?</h2>
        <p className="text-gray-500 leading-relaxed">
          Type a description on the left to generate stunning AI art. Try being as descriptive as possible about styles, lighting, and subjects.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl animate-in fade-in duration-500">
      <div className={`relative w-full glass rounded-3xl overflow-hidden shadow-2xl ${image ? getAspectClass(image.config.aspectRatio) : 'aspect-square'}`}>
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-8">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-white mb-2 animate-pulse">
              {loadingMessages[currentMessageIndex]}
            </p>
            <p className="text-sm text-gray-500">Usually takes 5-15 seconds</p>
          </div>
        ) : image ? (
          <>
            <img 
              src={image.url} 
              alt={image.prompt}
              className="w-full h-full object-contain bg-black/50 transition-opacity duration-1000"
            />
            
            {/* Action Overlay */}
            <div className="absolute bottom-6 right-6 flex gap-3 group">
              <button 
                onClick={handleDownload}
                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white transition-all transform hover:scale-105 active:scale-95"
                title="Download Image"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(image.prompt);
                  alert("Prompt copied!");
                }}
                className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white transition-all transform hover:scale-105 active:scale-95"
                title="Copy Prompt"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </>
        ) : null}
      </div>

      {image && !isGenerating && (
        <div className="mt-8 p-6 glass rounded-2xl border-gray-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Metadata</h3>
            <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">
              {new Date(image.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed italic">
            &quot;{image.prompt}&quot;
          </p>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Engine:</span>
                <span className="text-xs text-blue-400">{image.config.model.split('-')[1].toUpperCase()}</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Ratio:</span>
                <span className="text-xs text-blue-400">{image.config.aspectRatio}</span>
             </div>
             {image.config.imageSize && (
               <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Res:</span>
                  <span className="text-xs text-blue-400">{image.config.imageSize}</span>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
