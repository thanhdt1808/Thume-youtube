
import React, { useState, useMemo } from 'react';
import { EmotionalTone, ThumbnailConfig, ImageAdjustments, ThumbnailStrategy, PrimaryMode } from './types';
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
  vibrancy: 100,
  intensity: 0
};

const DEFAULT_STRATEGY: ThumbnailStrategy = {
  clarity: 'High',
  contrast: 'Strong',
  focus: 'Subject',
  mobile: 'Extreme'
};

const LAYOUT_PRESETS = [
  { id: 'left-text', name: 'Mặt Phải', icon: '👤💬' },
  { id: 'right-text', name: 'Mặt Trái', icon: '💬👤' },
  { id: 'split', name: 'So Sánh', icon: '🌓' },
  { id: 'center', name: 'Trung Tâm', icon: '🎯' },
  { id: 'minimal', name: 'Tối Giản', icon: '⚪' },
  { id: 'dark-vibe', name: 'Bí Ẩn', icon: '🌙' },
];

const STRATEGY_OPTIONS = {
  clarity: ['Standard', 'High', 'Ultra'],
  contrast: ['Soft', 'Strong', 'Aggressive'],
  focus: ['Subject', 'Text', 'Background', 'Balanced'],
  mobile: ['Standard', 'Optimal', 'Extreme']
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'strategy' | 'adjust'>('config');
  const [config, setConfig] = useState<ThumbnailConfig>({
    text: "KHÁM PHÁ SỰ THẬT",
    subjectDescription: "Một chuyên gia công nghệ đang kinh ngạc trước màn hình laptop phát sáng",
    tone: EmotionalTone.SHOCK,
    referenceImage: null,
    primaryColor: "#6366f1",
    primaryMode: PrimaryMode.AUTO,
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    strategy: { ...DEFAULT_STRATEGY },
    layoutPresetId: 'minimal',
    autoCorrection: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);

  const updateAdjustments = (key: keyof ImageAdjustments, value: any) => {
    setConfig(prev => ({ ...prev, adjustments: { ...prev.adjustments, [key]: value } }));
  };

  const updateStrategy = (key: keyof ThumbnailStrategy, value: any) => {
    setConfig(prev => ({ ...prev, strategy: { ...prev.strategy, [key]: value } }));
  };

  const randomizeStrategy = () => {
    const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const newStrategy: ThumbnailStrategy = {
      clarity: getRandom(STRATEGY_OPTIONS.clarity),
      contrast: getRandom(STRATEGY_OPTIONS.contrast),
      focus: getRandom(STRATEGY_OPTIONS.focus),
      mobile: getRandom(STRATEGY_OPTIONS.mobile)
    };
    setConfig(prev => ({ ...prev, strategy: newStrategy }));
  };

  const randomizeAdjustments = () => {
    const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    const newAdjustments: ImageAdjustments = {
      ...DEFAULT_ADJUSTMENTS,
      intensity: randomRange(0, 100),
      brightness: randomRange(70, 150),
      contrast: randomRange(80, 160),
      vibrancy: randomRange(80, 180),
      blur: randomRange(0, 12),
      temperature: randomRange(-50, 50)
    };
    setConfig(prev => ({ ...prev, adjustments: newAdjustments }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (mode: 'new' | 'refine' | 'text' = 'new') => {
    setIsLoading(true);
    
    const tempConfig = { ...config };
    if ((mode === 'refine' || mode === 'text') && resultImage) {
      tempConfig.referenceImage = resultImage;
    }

    setStatus(
      mode === 'refine' ? "Đang tinh chỉnh chi tiết..." : 
      mode === 'text' ? "Đang sửa lỗi và cập nhật chữ..." : 
      "Đang tạo thiết kế..."
    );

    try {
      const imageUrl = await generateThumbnail(
        tempConfig, 
        mode === 'refine', 
        mode === 'text'
      );
      setResultImage(imageUrl);
      setStatus("Hoàn tất!");
      setTimeout(() => setStatus(""), 1000);
    } catch (error) {
      console.error(error);
      alert(`Lỗi: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar: Layout Rack */}
      <aside className="w-20 lg:w-24 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 space-y-6 z-50">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg mb-4">T</div>
        <div className="flex-1 flex flex-col space-y-3 w-full px-2">
          <p className="text-[8px] font-black uppercase text-slate-500 text-center tracking-widest mb-1">Bố Cục</p>
          {LAYOUT_PRESETS.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setConfig(prev => ({ ...prev, layoutPresetId: layout.id }))}
              title={layout.name}
              className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all group ${config.layoutPresetId === layout.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-slate-800/40 text-slate-500 hover:bg-slate-800 hover:text-slate-300 border border-transparent hover:border-slate-700'}`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{layout.icon}</span>
              <span className="text-[7px] font-black uppercase mt-1 hidden lg:block text-center">{layout.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Controls Column */}
        <section className="w-full lg:w-[420px] bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
          <div className="flex border-b border-slate-800">
            {[
              { id: 'config', label: 'Cấu Hình' },
              { id: 'strategy', label: 'Chiến Lược' },
              { id: 'adjust', label: 'Tùy Chỉnh' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {activeTab === 'config' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Danh Tính Hình Ảnh</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tiêu Đề Chính</label>
                        {resultImage && (
                          <button 
                            onClick={() => handleGenerate('text')} 
                            disabled={isLoading}
                            className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                            title="Bấm vào đây nếu chữ trong ảnh bị lỗi hoặc muốn đổi chữ mới"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            <span>Sửa lỗi chữ gen</span>
                          </button>
                        )}
                      </div>
                      <input type="text" value={config.text} onChange={e => setConfig(prev => ({...prev, text: e.target.value}))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                      {resultImage && <p className="text-[9px] text-slate-500 italic">* Nếu chữ gen bị lỗi dấu, hãy bấm "Sửa lỗi chữ gen" ở trên.</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mô Tả Đối Tượng</label>
                      <textarea rows={2} value={config.subjectDescription} onChange={e => setConfig(prev => ({...prev, subjectDescription: e.target.value}))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ảnh Tham Chiếu / Gốc</label>
                      <div className="flex items-center space-x-3">
                        <label className="flex-1 bg-slate-800 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          <svg className="w-6 h-6 text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{config.referenceImage ? "Đã Chọn Ảnh" : "Tải Ảnh Lên"}</span>
                        </label>
                        {config.referenceImage && (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700">
                             <img src={config.referenceImage} className="w-full h-full object-cover" alt="Ref" />
                             <button onClick={() => setConfig(prev => ({...prev, referenceImage: null}))} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl hover:bg-red-600 transition-colors">
                               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Bộ Máy AI</h4>
                  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: PrimaryMode.DISABLED, label: 'Tắt' },
                        { id: PrimaryMode.ENABLED, label: 'Bật' },
                        { id: PrimaryMode.AUTO, label: 'Tự Động' }
                      ].map(m => (
                        <button key={m.id} onClick={() => setConfig(prev => ({...prev, primaryMode: m.id}))} className={`py-2 text-[9px] font-black uppercase rounded-lg border transition-all ${config.primaryMode === m.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                    {config.primaryMode === PrimaryMode.ENABLED && (
                      <div className="flex items-center space-x-3 pt-2">
                        <input type="color" value={config.primaryColor} onChange={e => setConfig(prev => ({...prev, primaryColor: e.target.value}))} className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer" />
                        <span className="text-[10px] font-mono text-slate-400">{config.primaryColor}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tông Màu Cảm Xúc</label>
                  <select value={config.tone} onChange={e => setConfig(prev => ({...prev, tone: e.target.value as EmotionalTone}))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                    {Object.values(EmotionalTone).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thiết Lập Chiến Lược</h4>
                  <button 
                    onClick={randomizeStrategy}
                    className="flex items-center space-x-2 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <span>Ngẫu Nhiên</span>
                  </button>
                </div>
                <StrategySelect label="Độ Rõ Nét" value={config.strategy.clarity} options={STRATEGY_OPTIONS.clarity} onChange={v => updateStrategy('clarity', v)} />
                <StrategySelect label="Độ Tương Phản Ánh Sáng" value={config.strategy.contrast} options={STRATEGY_OPTIONS.contrast} onChange={v => updateStrategy('contrast', v)} />
                <StrategySelect label="Tiêu Điểm" value={config.strategy.focus} options={STRATEGY_OPTIONS.focus} onChange={v => updateStrategy('focus', v)} />
                <StrategySelect label="Tối Ưu Di Động" value={config.strategy.mobile} options={STRATEGY_OPTIONS.mobile} onChange={v => updateStrategy('mobile', v)} />
              </div>
            )}

            {activeTab === 'adjust' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tùy Chỉnh Thủ Công</h4>
                  <button 
                    onClick={randomizeAdjustments}
                    className="flex items-center space-x-2 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <span>Ngẫu Nhiên</span>
                  </button>
                </div>
                <SliderBox label="Cường Độ Tổng Thể" value={config.adjustments.intensity} min={0} max={100} onChange={v => updateAdjustments('intensity', v)} />
                <div className="pt-4 border-t border-slate-800 space-y-6">
                  <SliderBox label="Độ Sáng" value={config.adjustments.brightness} min={0} max={200} onChange={v => updateAdjustments('brightness', v)} />
                  <SliderBox label="Độ Tương Phản" value={config.adjustments.contrast} min={0} max={200} onChange={v => updateAdjustments('contrast', v)} />
                  <SliderBox label="Đèn Viền (Rim-Light)" value={config.adjustments.vibrancy} min={0} max={200} onChange={v => updateAdjustments('vibrancy', v)} />
                  <SliderBox label="Độ Sâu Trường Ảnh" value={config.adjustments.blur} min={0} max={20} unit="px" onChange={v => updateAdjustments('blur', v)} />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900 border-t border-slate-800">
            <button 
              onClick={() => handleGenerate('new')} 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-indigo-500/10 transition-all flex items-center justify-center space-x-3 active:scale-[0.98]"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              <span>Tạo Thumbnail Mới</span>
            </button>
          </div>
        </section>

        {/* Preview Panel */}
        <section className="flex-1 bg-slate-950 p-6 lg:p-10 overflow-y-auto space-y-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <h3 className="text-xl font-black uppercase tracking-tighter text-slate-400 italic">Bản Xem Trước</h3>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              {resultImage && (
                 <div className="flex space-x-3">
                    <button 
                      onClick={() => handleGenerate('text')} 
                      disabled={isLoading} 
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-4 py-2 rounded-xl border border-indigo-400/20 hover:bg-indigo-600 hover:text-white transition-all flex items-center space-x-2"
                      title="Sửa lỗi hiển thị chữ hoặc đổi nội dung chữ"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      <span>Sửa Chữ</span>
                    </button>
                    <button 
                      onClick={() => handleGenerate('refine')} 
                      disabled={isLoading} 
                      className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/20 hover:bg-amber-400 hover:text-black transition-all flex items-center space-x-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      <span>Tinh Chỉnh</span>
                    </button>
                    <button onClick={() => { const l = document.createElement('a'); l.href = resultImage; l.download = 'youtube-thumbnail.png'; l.click(); }} className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20 hover:bg-emerald-600 hover:text-white transition-all">Xuất Ảnh 4K</button>
                 </div>
              )}
            </div>

            <ThumbnailPreview imageUrl={resultImage} isLoading={isLoading} statusMessage={status} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Chế Độ Bố Cục" value={LAYOUT_PRESETS.find(p => p.id === config.layoutPresetId)?.name || config.layoutPresetId} color="indigo" />
              <MetricCard label="Bộ Máy AI" value={config.primaryMode === PrimaryMode.AUTO ? "Tự Động" : config.primaryMode === PrimaryMode.ENABLED ? "Bật" : "Tắt"} color="emerald" />
              <MetricCard label="Di Động" value={config.strategy.mobile === 'Extreme' ? "Tối Đa" : config.strategy.mobile} color="amber" />
              <MetricCard label="Cường Độ" value={`${config.adjustments.intensity}%`} color="sky" />
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ghi Đè Độ Chính Xác Cao</h4>
                <button 
                  onClick={randomizeAdjustments}
                  className="flex items-center space-x-2 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span>Phối Màu Ngẫu Nhiên</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <SliderBox label="Lớp Phơi Sáng" value={config.adjustments.brightness} min={0} max={200} onChange={v => updateAdjustments('brightness', v)} />
                <SliderBox label="Lớp Tương Phản" value={config.adjustments.contrast} min={0} max={200} onChange={v => updateAdjustments('contrast', v)} />
                <SliderBox label="Đèn Viền Đối Tượng" value={config.adjustments.vibrancy} min={0} max={200} onChange={v => updateAdjustments('vibrancy', v)} />
                <SliderBox label="Độ Sâu Bóng Đổ" value={config.adjustments.intensity} min={0} max={100} onChange={v => updateAdjustments('intensity', v)} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const StrategySelect: React.FC<{ label: string; value: string; options: string[]; onChange: (v: any) => void }> = ({ label, value, options, onChange }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <div className="grid grid-cols-2 gap-2">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} className={`py-3 text-[9px] font-black uppercase rounded-xl border transition-all ${value === opt ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'}`}>
          {opt === 'Extreme' ? 'Tối Đa' : opt === 'High' ? 'Cao' : opt === 'Ultra' ? 'Siêu Cấp' : opt === 'Optimal' ? 'Tối Ưu' : opt === 'Standard' ? 'Chuẩn' : opt === 'Aggressive' ? 'Mạnh' : opt === 'Strong' ? 'Rõ' : opt === 'Soft' ? 'Mềm' : opt === 'Subject' ? 'Đối Tượng' : opt === 'Text' ? 'Văn Bản' : opt === 'Background' ? 'Nền' : opt === 'Balanced' ? 'Cân Bằng' : opt}
        </button>
      ))}
    </div>
  </div>
);

const SliderBox: React.FC<{ label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void }> = ({ label, value, min, max, unit = "%", onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
      <div className="flex items-center space-x-2">
         <input type="number" value={value} min={min} max={max} onChange={e => onChange(Number(e.target.value))} className="w-14 bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-[10px] font-mono text-indigo-400 text-center outline-none" />
         <span className="text-[9px] font-mono text-slate-500 uppercase">{unit}</span>
      </div>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500" />
  </div>
);

const MetricCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 text-center shadow-lg">
    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-xs font-black uppercase tracking-tighter text-${color}-400`}>{value}</p>
  </div>
);

export default App;
