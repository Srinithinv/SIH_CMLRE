'use client';
import { useState, useEffect } from 'react';

export default function IngestionPage() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/ingestion/records');
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('http://localhost:8000/api/v1/ingestion/upload/oceanographic', {
          method: 'POST',
          body: formData
        });
        if (res.ok) fetchRecords();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const verifyFile = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/ingestion/records/${id}/verify`, {
        method: 'PATCH'
      });
      if (res.ok) fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-10">
      <header>
        <h2 className="title-lg">Data Ingestion</h2>
        <p className="subtitle">Upload heterogeneous marine datasets for AI modeling and archival.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`border-2 border-dashed rounded-2xl p-20 flex flex-col items-center justify-center transition-all duration-300 ${
                dragging ? 'border-primary bg-blue-50/50 scale-[0.99]' : 'border-gray-200 bg-gray-50/30'
              }`}
            >
               <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-4xl mb-6">📂</div>
               <h3 className="text-lg font-bold text-gray-900">Drag & drop files here</h3>
               <p className="text-sm text-gray-400 mt-2 mb-8">Supports .csv, .xlsx, .fasta, and .json formats</p>
               <input 
                  type="file" 
                  id="browse-upload" 
                  className="hidden" 
                  onChange={handleFileUpload}
               />
               <button 
                  onClick={() => document.getElementById('browse-upload')?.click()}
                  className="btn-primary"
               >
                  Browse Files
               </button>
            </div>

            <div className="clean-card">
               <h3 className="text-sm font-bold text-gray-600 mb-6">Recent Ingestions</h3>
               <div className="space-y-4">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:border-gray-100 transition-colors animate-in slide-in-from-left-2 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold ${
                            f.status === 'Verified' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-400'
                          }`}>{f.file_type}</div>
                          <div>
                             <p className={`text-sm font-bold ${f.status === 'Verified' ? 'text-gray-900' : 'text-gray-600'}`}>{f.filename}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{f.file_size} • {new Date(f.upload_date).toLocaleDateString()}</p>
                          </div>
                       </div>
                       
                       {f.status === 'Verified' ? (
                         <div className="flex items-center gap-1.5 text-green-500 font-bold text-[10px] uppercase tracking-widest">
                            <span className="text-sm">✓</span> Verified
                         </div>
                       ) : (
                         <button 
                            onClick={() => verifyFile(f.id)}
                            className="text-blue-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
                         >
                            Verify
                         </button>
                       )}
                    </div>
                  ))}
                  {files.length === 0 && !loading && <p className="text-sm text-gray-400 italic text-center py-4">No recent ingestions found.</p>}
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="clean-card !bg-blue-600 !border-none text-white shadow-xl shadow-blue-500/20">
               <h3 className="text-sm font-bold border-b border-white/20 pb-3 mb-4 uppercase tracking-widest text-white">System Health</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-blue-50 font-medium">Storage Capacity</span>
                     <span className="text-sm font-bold text-white">42% Used</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white transition-all w-[42%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-relaxed pt-4 font-medium uppercase tracking-tight">AI ingestion pipelines are active. Parallel processing enabled for FASTA sequences.</p>
               </div>
            </div>

            <div className="clean-card">
               <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">Integration Status</h3>
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     <span className="text-sm font-medium text-gray-600">PostgreSQL Cloud</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     <span className="text-sm font-medium text-gray-600">FastAPI Ingest Engine</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                     <span className="text-sm font-medium text-gray-600">AWS S3 (Pending)</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
