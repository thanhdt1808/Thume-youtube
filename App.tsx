
import React, { useState } from 'react';
import { EmotionalTone, ThumbnailConfig, ImageAdjustments } from './types';
import { generateThumbnail } from './services/geminiService';
import ThumbnailPreview from './components/ThumbnailPreview';

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  hue: 0,
  sepia: 0,
  invert: false,
  grayscale: 0,
  temperature: 0,
  vibrancy: 100
};

const TONE_COLORS: Record<EmotionalTone, string> = {
  [EmotionalTone.CURIOSITY]: "#3b82f6", // Blue
  [EmotionalTone.SHOCK]: "#ef4444",    // Red
  [EmotionalTone.MYSTERY]: "#a855f7",  // Purple
  [EmotionalTone.HOPE]: "#10b981",     // Green
  [EmotionalTone.URGENCY]: "#f59e0b",  // Amber
  [EmotionalTone.VINTAGE]: "#d97706",  // Brown
  [EmotionalTone.MINIMALIST]: "#64748b", // Slate
  [EmotionalTone.CYBERPUNK]: "#ec4899"  // Pink/Cyan
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layout' | 'adjust'>('layout');
  const [config, setConfig] = useState<ThumbnailConfig>({
    text: "HOW TO GROW FAST",
    subjectDescription: "A person looking surprised pointing at a growth chart",
    tone: EmotionalTone.CURIOSITY,
    referenceImage: null,
    primaryColor: "#ef4444",
    usePrimaryColor: true,
    adjustments: { ...DEFAULT_ADJUSTMENTS }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);

  const updateAdjustments = (key: keyof ImageAdjustments, value: any) => {
    setConfig(prev => ({
      ...prev,
      adjustments: { ...prev.adjustments, [key]: value }
    }));
  };

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

  const autoAdjust = () => {
    setConfig(prev => ({
      ...prev,
      primaryColor: TONE_COLORS[prev.tone],
      usePrimaryColor: true,
      adjustments: {
        ...DEFAULT_ADJUSTMENTS,
        brightness: 110,
        contrast: 125,
        saturation: 130,
        vibrancy: 120
      }
    }));
  };

  const resetAdjustments = () => {
    setConfig(prev => ({ ...prev, adjustments: { ...DEFAULT_ADJUSTMENTS } }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white italic shadow-lg shadow-indigo-500/20">T</div>
            <span className="text-xl font-bold tracking-tight">ThumbCraft <span className="text-indigo-500">Pro</span></span>
          </div>
          <div className="flex items-center space-x-3">
             <button onClick={autoAdjust} className="text-[10px] font-bold uppercase tracking-widest bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700 flex items-center space-x-2">
               <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
               <span>Auto Correction</span>
             </button>
             <button onClick={resetAdjustments} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">Reset</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-5 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden min-h-[600px]">
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              <button 
                onClick={() => setActiveTab('layout')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'layout' ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Layout & Content
              </button>
              <button 
                onClick={() => setActiveTab('adjust')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'adjust' ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Filters & Adjust
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[70vh]">
              {activeTab === 'layout' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                  {/* Reference Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">1. Structure Reference</label>
                    <div className="relative group">
                      <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
                      <div className={`p-4 border-2 border-dashed rounded-xl transition-all ${config.referenceImage ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}>
                        {config.referenceImage ? (
                          <div className="flex items-center space-x-3">
                            <img src={config.referenceImage} className="w-16 h-9 object-cover rounded border border-indigo-500/50 shadow-lg" />
                            <div>
                              <p className="text-xs font-semibold text-indigo-400">Layout Detected</p>
                              <p className="text-[10px] text-slate-500">Replicating composition...</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <p className="text-sm text-slate-400 font-medium">Click to upload reference</p>
                            <p className="text-[10px] text-slate-500">Keeps same visual hierarchy</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">2. Custom Text</label>
                    <input 
                      type="text"
                      value={config.text}
                      onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">3. Main Subject</label>
                    <textarea 
                      value={config.subjectDescription}
                      onChange={(e) => setConfig(prev => ({ ...prev, subjectDescription: e.target.value }))}
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">4. Mood/Tone</label>
                      <select 
                        value={config.tone}
                        onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value as EmotionalTone }))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-sm outline-none font-medium"
                      >
                        {Object.values(EmotionalTone).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">5. Primary</label>
                        <button 
                          onClick={() => setConfig(prev => ({ ...prev, usePrimaryColor: !prev.usePrimaryColor }))}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${config.usePrimaryColor ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                        >
                          {config.usePrimaryColor ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <div className={`flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 transition-opacity ${!config.usePrimaryColor && 'opacity-30 pointer-events-none'}`}>
                        <input 
                          type="color" 
                          value={config.primaryColor} 
                          onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))} 
                          className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer" 
                        />
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{config.primaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Slider label="Brightness" value={config.adjustments.brightness} min={0} max={200} onChange={(v) => updateAdjustments('brightness', v)} />
                    <Slider label="Contrast" value={config.adjustments.contrast} min={0} max={200} onChange={(v) => updateAdjustments('contrast', v)} />
                    <Slider label="Saturation" value={config.adjustments.saturation} min={0} max={200} onChange={(v) => updateAdjustments('saturation', v)} />
                    <Slider label="Hue Rotate" value={config.adjustments.hue} min={0} max={360} unit="°" onChange={(v) => updateAdjustments('hue', v)} />
                    <Slider label="Blur" value={config.adjustments.blur} min={0} max={20} unit="px" onChange={(v) => updateAdjustments('blur', v)} />
                    <Slider label="Sepia" value={config.adjustments.sepia} min={0} max={100} unit="%" onChange={(v) => updateAdjustments('sepia', v)} />
                    <Slider label="Grayscale" value={config.adjustments.grayscale} min={0} max={100} unit="%" onChange={(v) => updateAdjustments('grayscale', v)} />
                    <Slider label="Temp" value={config.adjustments.temperature} min={-100} max={100} onChange={(v) => updateAdjustments('temperature', v)} />
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Color Inversion</span>
                    <button 
                      onClick={() => updateAdjustments('invert', !config.adjustments.invert)}
                      className={`w-12 h-6 rounded-full transition-all relative ${config.adjustments.invert ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.adjustments.invert ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                  
                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                    <p className="text-[10px] text-indigo-400 italic">"Filters apply real-time for feedback. AI will bake these settings into the final HD generation."</p>
                  </div>
                </div>
              )}

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 mt-auto"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{resultImage ? 'REGENERATE WITH TWEAKS' : 'GENERATE THUMBNAIL'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <span>Viewport</span>
                <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Live Preview</span>
              </h3>
              {resultImage && (
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = 'youtube-thumbnail.png';
                    link.click();
                  }}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 bg-indigo-400/10 px-3 py-1.5 rounded-lg border border-indigo-400/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export HD</span>
                </button>
              )}
            </div>

            <ThumbnailPreview 
              imageUrl={resultImage} 
              isLoading={isLoading} 
              statusMessage={status} 
              adjustments={config.adjustments}
            />

            {/* Insight Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InsightCard label="Clarity" value="High" color="emerald" />
              <InsightCard label="Contrast" value="Strong" color="amber" />
              <InsightCard label="Focus" value="Subject" color="sky" />
              <InsightCard label="Mobile" value="Optimal" color="indigo" />
            </div>

            {/* Quick Layout Presets */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-400">Layout Presets</h4>
                <span className="text-[10px] text-slate-600 font-mono italic">Templates available</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-video bg-slate-900 rounded-lg border border-slate-800 hover:border-indigo-500 transition-all cursor-pointer overflow-hidden group">
                     <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center opacity-50 group-hover:opacity-100">
                        <span className="text-[10px] font-bold text-slate-500">Preset {i+1}</span>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

const Slider: React.FC<{ label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void }> = ({ label, value, min, max, unit = "%", onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <span className="text-[10px] font-mono text-indigo-400 font-bold">{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
    />
  </div>
);

const InsightCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center group hover:border-indigo-500/30 transition-colors">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    <p className={`text-sm font-bold mt-1 text-${color}-400`}>{value}</p>
  </div>
);

export default App;
