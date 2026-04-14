'use client';
import { useState, useEffect } from 'react';

export default function TaxonomyPage() {
  const [taxa, setTaxa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSpecies, setNewSpecies] = useState({ species: '', family: '', common_name: '', status: 'Stable' });

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/taxonomy/species');
      const data = await res.json();
      setTaxa(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSpecies = async () => {
    if (!newSpecies.species || !newSpecies.family) return;
    try {
      const res = await fetch('http://localhost:8000/api/v1/taxonomy/species', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpecies)
      });
      if (res.ok) {
        fetchSpecies();
        setShowModal(false);
        setNewSpecies({ species: '', family: '', common_name: '', status: 'Stable' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="title-lg">Taxonomic Registry</h2>
          <p className="subtitle">Browse and manage marine species classification metadata.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Add New Species
        </button>
      </header>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm animate-in fade-in transition-all">
          <div className="clean-card w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Register New Species</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Scientific Name</label>
                <input 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  placeholder="e.g. Lutjanus kasmira"
                  value={newSpecies.species}
                  onChange={e => setNewSpecies({...newSpecies, species: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Family</label>
                <input 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  placeholder="e.g. Lutjanidae"
                  value={newSpecies.family}
                  onChange={e => setNewSpecies({...newSpecies, family: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Common Name</label>
                <input 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-primary shadow-inner"
                  placeholder="e.g. Bluestripe Snapper"
                  value={newSpecies.common_name}
                  onChange={e => setNewSpecies({...newSpecies, common_name: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary !w-full">Cancel</button>
              <button onClick={addSpecies} className="btn-primary !w-full">Add to Registry</button>
            </div>
          </div>
        </div>
      )}

      <div className="clean-card overflow-hidden !p-0">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-bold text-gray-600">Species Database <span className="ml-2 font-normal text-gray-400">({taxa.length})</span></h3>
            <input type="text" placeholder="Search registry..." className="w-full sm:w-auto px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Scientific Name</th>
                <th className="px-8 py-4">Family</th>
                <th className="px-8 py-4">Common Name</th>
                <th className="px-8 py-4">Conservation Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {taxa.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-5">
                     <p className="font-bold text-gray-900 group-hover:text-primary">{t.species}</p>
                     <p className="text-xs text-gray-400 font-medium italic">Rank: Species</p>
                  </td>
                  <td className="px-8 py-5 text-gray-600 font-medium">{t.family}</td>
                  <td className="px-8 py-5 text-gray-600">{t.common_name}</td>
                  <td className="px-8 py-5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                       t.status === 'Vulnerable' ? 'bg-orange-50 text-orange-600' : 
                       t.status === 'Near Threatened' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                     }`}>
                       {t.status}
                     </span>
                  </td>
                  <td className="px-8 py-5">
                     <button className="text-gray-400 hover:text-primary transition-colors font-bold text-sm">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
