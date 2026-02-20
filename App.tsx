
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AspectRatio, 
  ImageSize, 
  ModelType, 
  GeneratedImage, 
  GenerationConfig 
} from './types';
import { generateImage } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ImageDisplay from './components/ImageDisplay';
import HistoryPanel from './components/HistoryPanel';
import Header from './components/Header';

const App: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    prompt: '',
    model: ModelType.FLASH,
    aspectRatio: AspectRatio.SQ,
    imageSize: ImageSize.K1
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dreamcanvas_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('dreamcanvas_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!config.prompt.trim()) {
      setError("Please enter a prompt to generate an image.");
      return;
    }

    // Pro model requires explicit API key selection in AI Studio environment
    if (config.model === ModelType.PRO) {
      // @ts-ignore
      const hasKey = await window.aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio?.openSelectKey();
        // Proceeding as if successful per guidelines
      }
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateImage(
        config.prompt,
        config.model,
        config.aspectRatio,
        config.imageSize
      );

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: config.prompt,
        timestamp: Date.now(),
        config: {
          model: config.model,
          aspectRatio: config.aspectRatio,
          imageSize: config.model === ModelType.PRO ? config.imageSize : undefined
        }
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 50));
    } catch (err: any) {
      if (err.message === "API_KEY_RESET_REQUIRED") {
        setError("API Key Error. Please re-select your key.");
        // @ts-ignore
        await window.aistudio?.openSelectKey();
      } else {
        setError(err.message || "An unexpected error occurred during generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const selectFromHistory = (img: GeneratedImage) => {
    setCurrentImage(img);
    setConfig(prev => ({
      ...prev,
      prompt: img.prompt,
      model: img.config.model,
      aspectRatio: img.config.aspectRatio,
      imageSize: img.config.imageSize || prev.imageSize
    }));
    if (window.innerWidth < 1024) setShowHistory(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#030712] overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Workspace */}
        <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          
          {/* Controls Sidebar */}
          <Sidebar 
            config={config} 
            setConfig={setConfig} 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating}
          />

          {/* Canvas Area */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col items-center justify-center bg-gray-950/30">
            {error && (
              <div className="mb-6 p-4 glass border-red-500/50 text-red-400 rounded-xl max-w-2xl w-full flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <ImageDisplay 
              image={currentImage} 
              isGenerating={isGenerating} 
            />
          </div>
        </main>

        {/* Floating History Toggle for Mobile */}
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="fixed bottom-6 right-6 lg:hidden z-50 p-4 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* History Panel */}
        <HistoryPanel 
          history={history} 
          onSelect={selectFromHistory} 
          isOpen={showHistory}
          setIsOpen={setShowHistory}
        />
      </div>
    </div>
  );
};

export default App;
