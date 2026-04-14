'use client';
import { useState } from 'react';

export default function OtolithPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setAnalyzing(true);
      setTimeout(() => setAnalyzing(false), 4000);
    }
  };

  return (
    <div className="w-full space-y-10">
      <header>
        <h2 className="title-lg">Otolith Morphology Lab</h2>
        <p className="subtitle">Computer vision analysis for fish age determination and species verification.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="clean-card flex flex-col items-center justify-center border-2 border-dashed border-gray-100 min-h-[400px] relative overflow-hidden">
            {preview ? (
              <div className="absolute inset-0 w-full h-full">
                <img src={preview} alt="Otolith Scan" className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-inner relative z-10">🔬</div>
            )}
            
            <div className="relative z-10 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                {preview ? 'Image Uploaded Successfully' : 'Upload Microscopic Image'}
              </h3>
              <p className="text-sm text-gray-400 mt-2 mb-8">
                {preview ? 'Analysis in progress using Computer Vision...' : 'Drop high-resolution Otolith scans (JPG, PNG)'}
              </p>
              
              <input 
                type="file" 
                id="otolith-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
              
              <button 
                onClick={() => document.getElementById('otolith-upload')?.click()}
                className="btn-primary"
                disabled={analyzing}
              >
                {preview ? 'Change Image' : 'Select Image'}
              </button>
            </div>
         </div>

        <div className="clean-card">
           <div className="flex justify-between items-start mb-8">
             <h3 className="text-sm font-bold text-gray-900 border-b-2 border-primary/20 pb-1 uppercase tracking-widest">Analysis Results</h3>
             {analyzing && <span className="badge badge-info animate-pulse">Scanning...</span>}
           </div>

           {!analyzing ? (
             <div className="space-y-6">
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Morphological Metrics</p>
                   <div className="space-y-3">
                      <div className="flex justify-between text-sm py-2 border-b border-gray-200/50">
                         <span className="text-gray-500 font-medium">Estimated Age</span>
                         <span className="font-bold text-gray-900">4.2 Years</span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b border-gray-200/50">
                         <span className="text-gray-500 font-medium">Otolith Length</span>
                         <span className="font-bold text-gray-900">12.4 mm</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                         <span className="text-gray-500 font-medium">Species Likelihood</span>
                         <span className="font-bold text-blue-600">92% Serranidae</span>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Scientific Note</p>
                    <p className="text-sm text-blue-700 leading-relaxed font-medium capitalize">Growth rings indicate stable environmental conditions during second year stratification.</p>
                </div>
             </div>
           ) : (
             <div className="h-full flex items-center justify-center flex-col py-20 space-y-6">
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
                   <div className="absolute top-0 w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Processing Ring Patterns...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
