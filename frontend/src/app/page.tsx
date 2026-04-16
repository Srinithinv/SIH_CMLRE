'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [anomaly, setAnomaly] = useState<any>(null);
  const [abundance, setAbundance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveParams, setLiveParams] = useState({ temp: 30.1, sal: 34.2, do: 5.1, ph: 8.1 });
  const [showFilters, setShowFilters] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    const fetchML = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const resA = await fetch(`${apiUrl}/api/v1/analytics/anomaly?temp=${liveParams.temp}&salinity=${liveParams.sal}&do=${liveParams.do}&ph=${liveParams.ph}`);
        const dataA = await resA.json();
        setAnomaly(dataA);

        const resB = await fetch(`${apiUrl}/api/v1/analytics/synthesis?temp=${liveParams.temp}&salinity=${liveParams.sal}`);
        const dataB = await resB.json();
        setAbundance(dataB);
      } catch (err) {
        console.error("Backend offline", err);
      } finally {
        setLoading(false);
      }
    };
    fetchML();

    const interval = setInterval(() => {
      setLiveParams(prev => ({
        temp: prev.temp + (Math.random() - 0.5) * 0.2,
        sal: prev.sal + (Math.random() - 0.5) * 0.05,
        do: prev.do + (Math.random() - 0.5) * 0.1,
        ph: prev.ph + (Math.random() - 0.5) * 0.02
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [liveParams]);

  const filterCategories = [
    { title: 'Spatial Domain', items: ['Bay of Bengal', 'Arabian Sea', 'Andaman Islands', 'Lakshadweep'] },
    { title: 'Physicochemical Range', items: ['Temperature: 25-32°C', 'Salinity: 30-35 PSU', 'Depth: 0-200m', 'PH Level: 7.5-8.5'] },
    { title: 'Biological Parameters', items: ['Phylum: Chordata', 'Phylum: Arthropoda', 'Phylum: Mollusca', 'Taxon: Epinephelus'] },
    { title: 'Cruise / Expedition', items: ['Cruise ID: SAGARSA-2024', 'Expedition: DeepScan 01', 'Vessel: RV Gaveshani'] },
  ];

  const filteredData = filterCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.toLowerCase().includes(filterSearch.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="space-y-12 py-10 px-4">
      {/* Header section with Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="title-lg !text-4xl">Command Center</h1>
          <p className="subtitle !text-base">Real-time oceanographic modeling and anomaly detection.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-primary !bg-blue-600 !py-3 flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            <span>🔍</span> Search Filters
          </button>
          
          {showFilters && (
            <div className="absolute top-14 right-0 w-80 clean-card !p-6 z-50 animate-in fade-in slide-in-from-top-2 shadow-2xl backdrop-blur-xl">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Search Parameters</h4>
                 <button onClick={() => setFilterSearch('')} className="text-[10px] font-bold text-blue-500 uppercase">Reset</button>
              </div>

              <div className="mb-6">
                 <input 
                    type="text" 
                    placeholder="Search e.g. 'Temp', 'Bengal'..." 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                 />
              </div>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredData.length > 0 ? filteredData.map((cat, idx) => (
                  <div key={idx} className="animate-in fade-in duration-500">
                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">{cat.title}</p>
                    <div className="flex flex-wrap gap-2">
                       {cat.items.map((item, i) => (
                         <span key={i} className="px-3 py-1.5 bg-blue-50/50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100/50 hover:bg-blue-100 transition-colors cursor-pointer">
                           {item}
                         </span>
                       ))}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                     <p className="text-xs text-gray-400 italic">No parameters match your search</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t">
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full btn-primary !py-3 !text-xs !bg-blue-600 hover:!bg-blue-700 shadow-xl shadow-blue-100"
                >
                  Apply {filteredData.length} Categories
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="btn-primary !py-3 flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70"
          >
            {isGenerating ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>📄</span>
            )}
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Metric Cards */}
        {[
          { label: 'Surface Temperature', value: `${liveParams.temp.toFixed(2)} °C`, trend: '+0.2%' },
          { label: 'Salinity Density', value: `${liveParams.sal.toFixed(2)} PSU`, trend: '-0.1%' },
          { label: 'Dissolved Oxygen', value: `${liveParams.do.toFixed(2)} mg/L`, trend: 'Stable' },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{m.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{m.value}</h3>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">{m.trend}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Anomaly Panel */}
        <div className="clean-card">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-primary/20 pb-1">Isolation Forest</h3>
              <p className="text-sm text-gray-400 mt-1">Anomaly Detection Engine</p>
            </div>
            <span className={loading ? 'badge badge-info' : (anomaly?.is_anomaly ? 'badge badge-danger animate-pulse' : 'badge badge-success')}>
              {loading ? 'Processing' : (anomaly?.is_anomaly ? 'Critical Alert' : 'Normal State')}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500 font-medium">Model Confidence Score</span>
              <span className="text-sm font-bold text-gray-900">{anomaly?.anomaly_score?.toFixed(4) || '0.0000'}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.abs(anomaly?.anomaly_score || 0) * 100}%` }}></div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed italic">
            " {loading ? 'Analyzing data streams...' : anomaly?.interpretation} "
          </p>
        </div>

        {/* Prediction Panel */}
        <div className="clean-card">
           <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-primary/20 pb-1">Random Forest</h3>
              <p className="text-sm text-gray-400 mt-1">Abundance Forecasting</p>
            </div>
            <span className="badge badge-info">Active Prediction</span>
          </div>

          <div className="flex items-center gap-8 py-4">
             <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Species Target</p>
                <h4 className="text-xl font-bold text-gray-800">Epinephelus coioides</h4>
                <div className="mt-6">
                   <h2 className="text-6xl font-black text-gray-900 tabular-nums">
                     {loading ? '---' : abundance?.ml_predictions?.predicted_abundance}
                   </h2>
                   <p className="text-sm text-gray-500 font-medium font-serif mt-2">Predicted individual count per quadrant</p>
                </div>
             </div>
             <div className="hidden sm:block w-px h-24 bg-gray-100"></div>
             <div className="hidden sm:flex flex-col items-center justify-center p-6 bg-blue-50/30 rounded-full border border-blue-50">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="animate-spin text-xl text-primary">⚙️</span>
                 </div>
                 <p className="text-[10px] font-bold text-primary mt-3 uppercase tracking-tighter">Inference live</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
