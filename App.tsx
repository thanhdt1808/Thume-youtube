
import React, { useState, useCallback } from 'react';
import { EmotionalTone, ThumbnailConfig } from './types';
import { generateThumbnail } from './services/geminiService';
import ThumbnailPreview from './components/ThumbnailPreview';

const App: React.FC = () => {
  const [config, setConfig] = useState<ThumbnailConfig>({
    text: "HOW TO GROW FAST",
    subjectDescription: "A person looking surprised pointing at a growth chart",
    tone: EmotionalTone.CURIOSITY,
    referenceImage: null,
    primaryColor: "#ef4444", // Tailwind red-500
    secondaryColor: "#ffffff"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setStatus("Analyzing layout...");
    try {
      setStatus("Designing thumbnail...");
      const imageUrl = await generateThumbnail(config);
      setResultImage(imageUrl);
      setStatus("Optimizing for mobile...");
      setTimeout(() => setStatus(""), 1000);
    } catch (error) {
      console.error(error);
      alert("Failed to generate thumbnail. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white italic">T</div>
            <span className="text-xl font-bold tracking-tight">ThumbCraft <span className="text-indigo-500">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Templates</a>
            <a href="#" className="hover:text-white transition-colors">Tutorials</a>
            <a href="#" className="hover:text-white transition-colors">Premium</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <header className="space-y-1">
              <h2 className="text-2xl font-bold">Thumbnail Designer</h2>
              <p className="text-sm text-slate-400">AI-powered recreation & optimization</p>
            </header>

            <div className="space-y-4">
              {/* Reference Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Reference Thumbnail (Optional)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                  />
                  <div className={`p-4 border-2 border-dashed rounded-xl transition-all ${config.referenceImage ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}>
                    {config.referenceImage ? (
                      <div className="flex items-center space-x-3">
                        <img src={config.referenceImage} className="w-16 h-9 object-cover rounded border border-indigo-500/50 shadow-lg" />
                        <div>
                          <p className="text-xs font-semibold text-indigo-400">Reference Loaded</p>
                          <p className="text-[10px] text-slate-500">We'll use this layout structure</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-sm text-slate-400">Drop reference image here or click</p>
                        <p className="text-[10px] text-slate-500">1280x720 recommended</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Thumbnail Text (3-5 Words)</label>
                <input 
                  type="text"
                  value={config.text}
                  onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="e.g. INSANE GROWTH SECRETS"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              {/* Subject Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">3. Main Subject / Object</label>
                <textarea 
                  value={config.subjectDescription}
                  onChange={(e) => setConfig(prev => ({ ...prev, subjectDescription: e.target.value }))}
                  placeholder="Describe the person, object, or scene..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium resize-none"
                />
              </div>

              {/* Row: Tone & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">4. Emotional Tone</label>
                  <select 
                    value={config.tone}
                    onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value as EmotionalTone }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(EmotionalTone).map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">5. Primary Color</label>
                  <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                    <input 
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono uppercase text-slate-400">{config.primaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>RECREATE THUMBNAIL</span>
                  </>
                )}
              </button>
            </div>

            <footer className="pt-4 border-t border-slate-800">
               <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span>V1.0.0 Alpha</span>
                  <span>Powered by Gemini 2.5</span>
               </div>
            </footer>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Generated Result</h3>
              {resultImage && (
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = 'youtube-thumbnail.png';
                    link.click();
                  }}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download 1280x720</span>
                </button>
              )}
            </div>

            <ThumbnailPreview 
              imageUrl={resultImage} 
              isLoading={isLoading} 
              statusMessage={status} 
            />

            {/* Strategy / Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-start space-x-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Mobile Ready</h4>
                  <p className="text-[10px] text-slate-500 mt-1">High-contrast text ensures readability on small screens.</p>
                </div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-start space-x-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase">CTR Optimized</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Visual hierarchy follows the rule of thirds for impact.</p>
                </div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-start space-x-3">
                <div className="p-2 bg-sky-500/10 rounded-lg">
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Clean Focus</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Background blur keeps the viewer's eyes on the prize.</p>
                </div>
              </div>
            </div>

            {/* Reference Gallery - Quick Select placeholders */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-bold text-slate-400">Popular Layout Structures</h4>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-video bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer overflow-hidden opacity-40 hover:opacity-100 group relative">
                     <img src={`https://picsum.photos/seed/${i + 20}/320/180`} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-[8px] font-bold">CLICK TO APPLY</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Floating Design Tips */}
      <div className="fixed bottom-6 right-6 hidden xl:block">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-2xl max-w-xs space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM14.243 14.243a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM6.464 14.95a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707z" />
            </svg>
            <span className="text-xs font-bold uppercase">Pro Tip</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            "Avoid more than 5 words. The human brain processes faces faster than text - make your subject's emotion clear!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
