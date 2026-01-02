
import React from 'react';

interface ThumbnailPreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  statusMessage: string;
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ imageUrl, isLoading, statusMessage }) => {
  return (
    <div className="relative w-full aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700 canvas-shadow">
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-slate-900/80 backdrop-blur-sm z-10">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-400 font-medium animate-pulse">{statusMessage}</p>
        </div>
      ) : null}

      {!imageUrl && !isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-2">
          <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm uppercase tracking-widest font-bold">Preview Area</span>
        </div>
      ) : (
        imageUrl && <img src={imageUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
      )}
      
      {/* Mobile Preview Simulation Overlay */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-[10px] text-white/80 border border-white/10 uppercase tracking-tighter">
        Mobile Size Check
      </div>
    </div>
  );
};

export default ThumbnailPreview;
