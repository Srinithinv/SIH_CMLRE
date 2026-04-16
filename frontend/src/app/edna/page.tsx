'use client';
import { useState } from 'react';

export default function EDNAViewer() {
  const [sequence, setSequence] = useState('>Sample_A_EEZ_74.2_12.1\nATGCGTCGATCATGCGAGTCGAGCTAGCTCTAGCTACGATCGTAGCTACGTAGCTACGATCGATC\nGATCGATCGCGCTAGCTAGCTGATCGATCGCGCTAGC');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runMatch = async () => {
    setLoading(true);
    try {
      const cleanSeq = sequence.replace(/\n|>/g, '');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/edna/match?sequence=${cleanSeq}`, { method: 'POST' });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-10">
      <header>
        <h2 className="title-lg">Molecular Analysis</h2>
        <p className="subtitle">Sequence alignment and species matching from environmental DNA.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 clean-card">
           <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Sequence Input (FASTA)</h3>
           <textarea 
             className="w-full h-64 p-6 bg-gray-50 border border-gray-100 rounded-xl font-mono text-sm text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none shadow-inner"
             value={sequence}
             onChange={(e) => setSequence(e.target.value)}
           />
           <div className="mt-8 flex justify-end">
             <button 
               onClick={runMatch}
               className="btn-primary w-full sm:w-auto"
               disabled={loading}
             >
               {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Match Sequence'}
             </button>
           </div>
        </div>

        <div className="lg:col-span-2 clean-card flex flex-col items-center justify-center text-center py-12">
            {!result && !loading && (
              <div className="space-y-4">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-3xl">🧬</div>
                 <h4 className="text-gray-900 font-bold">Awaiting Alignment</h4>
                 <p className="text-sm text-gray-400 max-w-[200px] mx-auto">Upload or paste a FASTA sequence to begin comparison.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-6">
                 <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                 <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-widest">Running ML Alignment...</p>
              </div>
            )}

            {result && !loading && (
              <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
                 <div>
                    <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Optimal Match</p>
                    <h3 className="text-3xl font-black text-gray-900">{result.matched_species}</h3>
                 </div>

                 <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100 relative overflow-hidden">
                    <div className="relative z-10">
                       <p className="text-6xl font-black text-primary mb-2 tabular-nums">{result.match_confidence}%</p>
                       <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Confidence Index</p>
                    </div>
                    {/* Subtle decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🧬</div>
                 </div>

                 <div className="text-left py-4 px-6 border border-gray-100 rounded-xl bg-gray-50/50">
                    <p className="text-xs font-bold text-gray-400 mb-2">Technical Summary</p>
                    <div className="space-y-1 text-sm text-gray-700 font-mono">
                       <p>Alignment Score: <span className="font-bold text-gray-900">{result.alignment_score} bps</span></p>
                       <p>Method: Blast-Approx-SIMD</p>
                    </div>
                 </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
