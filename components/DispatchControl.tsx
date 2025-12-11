
import React, { useState } from 'react';
import { 
  Radio, MapPin, Clock, Siren, ChevronRight, X, 
  ArrowRight, Shield, Flame, Stethoscope, CheckCircle,
  Truck, Navigation, AlertTriangle
} from 'lucide-react';
import { Incident, EmergencyUnit, UnitType, IncidentType } from '../types';

interface DispatchControlProps {
  incidents: Incident[];
  units: EmergencyUnit[];
  onBack: () => void;
}

const DispatchControl: React.FC<DispatchControlProps> = ({ incidents, units, onBack }) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [emergencyLights, setEmergencyLights] = useState(true);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  // Filter active incidents that need attention
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED').sort((a, b) => {
     // Sort by priority then timestamp
     const pScore = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
     if (pScore[a.priority] !== pScore[b.priority]) return pScore[b.priority] - pScore[a.priority];
     return a.timestamp.getTime() - b.timestamp.getTime();
  });

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  // Units logic
  const availableUnits = units.filter(u => u.status === 'AVAILABLE');
  const enRouteUnits = units.filter(u => u.status === 'EN_ROUTE');
  
  const handleIncidentSelect = (id: string) => {
    setSelectedIncidentId(id);
    setSelectedUnits([]);
  };

  const toggleUnitSelection = (unitId: string) => {
    if (selectedUnits.includes(unitId)) {
      setSelectedUnits(selectedUnits.filter(id => id !== unitId));
    } else {
      setSelectedUnits([...selectedUnits, unitId]);
    }
  };

  const getTypeIcon = (type: IncidentType | UnitType) => {
    switch (type) {
      case 'FIRE': return <Flame size={16} />;
      case 'MEDICAL':
      case 'AMBULANCE': return <Stethoscope size={16} />;
      case 'POLICE': return <Shield size={16} />;
      case 'TRAFFIC': return <Navigation size={16} />;
      default: return <Siren size={16} />;
    }
  };

  const getUnitIcon = (type: UnitType) => {
      switch(type) {
          case 'FIRE': return <Truck size={20} />;
          case 'AMBULANCE': return <Stethoscope size={20} />;
          case 'POLICE': return <Shield size={20} />;
      }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-8xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
               </button>
               <div>
                  <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                     <Radio className="text-blue-500 animate-pulse" /> EMERGENCY DISPATCH CONTROL
                  </h1>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> System Online</span>
                      <span>Avg Response: <span className="text-green-400 font-bold">4.2m</span></span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-gray-500 uppercase">Active Dispatches</span>
                 <span className="text-2xl font-bold text-blue-400">{enRouteUnits.length}</span>
            </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* LEFT PANEL: Incident Queue */}
         <div className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col">
             <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                 <h2 className="font-bold text-gray-300 text-sm">Awaiting Dispatch</h2>
                 {activeIncidents.length > 5 && (
                     <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">{activeIncidents.length} Pending</span>
                 )}
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                 {activeIncidents.map(inc => (
                     <div 
                        key={inc.id}
                        onClick={() => handleIncidentSelect(inc.id)}
                        className={`
                            p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:bg-slate-800
                            ${selectedIncidentId === inc.id ? 'bg-slate-800 border-l-blue-500 ring-1 ring-blue-500/50' : 'border-l-transparent border-b border-slate-800'}
                        `}
                     >
                         <div className="flex justify-between items-start mb-1">
                             <div className="flex items-center gap-2">
                                 {getTypeIcon(inc.type)}
                                 <span className="font-bold text-sm text-white">{inc.id}</span>
                             </div>
                             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                 inc.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 
                                 inc.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                             }`}>
                                 {inc.priority}
                             </span>
                         </div>
                         <div className="text-xs text-gray-400 mb-2 truncate">{inc.address}</div>
                         <div className="flex justify-between items-center">
                             <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                 <Clock size={10} /> {Math.floor((Date.now() - inc.timestamp.getTime())/60000)}m wait
                             </span>
                             {inc.assignedUnits.length === 0 && (
                                 <span className="text-[10px] text-red-400 font-bold uppercase">Needs Dispatch</span>
                             )}
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* MIDDLE PANEL: Unit Availability */}
         <div className="flex-1 bg-gray-950 flex flex-col relative">
             <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                 <h2 className="font-bold text-gray-300 text-sm">Unit Availability</h2>
                 <div className="flex gap-2">
                     <span className="text-xs bg-slate-800 px-2 py-1 rounded text-green-400 font-bold">{availableUnits.length} Ready</span>
                     <span className="text-xs bg-slate-800 px-2 py-1 rounded text-yellow-400 font-bold">{enRouteUnits.length} En Route</span>
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                 {/* Grid of Units */}
                 <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     {availableUnits.map(unit => (
                         <div 
                            key={unit.id}
                            className={`
                                bg-slate-900 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all group
                                ${selectedUnits.includes(unit.id) ? 'ring-2 ring-blue-500 bg-blue-900/10' : ''}
                            `}
                            onClick={() => selectedIncidentId && toggleUnitSelection(unit.id)}
                         >
                             <div className="flex justify-between items-start mb-2">
                                 <div className={`p-2 rounded-lg bg-slate-800 text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                                     {getUnitIcon(unit.type)}
                                 </div>
                                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                             </div>
                             <div className="font-bold text-white text-lg mb-1">{unit.id}</div>
                             <div className="text-xs text-gray-500 mb-2">{unit.location}</div>
                             {selectedIncidentId && (
                                 <div className={`text-xs font-bold text-center py-1 rounded mt-2 ${selectedUnits.includes(unit.id) ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400'}`}>
                                     {selectedUnits.includes(unit.id) ? 'SELECTED' : 'CLICK TO ASSIGN'}
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
             </div>

             {/* BOTTOM: En Route / Active Dispatches */}
             <div className="h-48 bg-slate-900 border-t border-slate-800 flex flex-col">
                 <div className="px-4 py-2 bg-slate-800 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Deployments</h3>
                 </div>
                 <div className="flex-1 overflow-x-auto p-2 space-y-1 custom-scrollbar">
                     {enRouteUnits.map(unit => (
                         <div key={unit.id} className="flex items-center gap-4 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                             <div className="w-16 font-bold text-sm text-white">{unit.id}</div>
                             <ArrowRight size={14} className="text-gray-600" />
                             <div className="w-24 text-xs font-mono text-blue-400">{unit.currentAssignment}</div>
                             <div className="flex-1">
                                 <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                     <span>En Route</span>
                                     <span>ETA: 2m</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-500 w-[60%] animate-pulse"></div>
                                 </div>
                             </div>
                             <button className="px-2 py-1 text-[10px] bg-slate-700 hover:bg-slate-600 text-white rounded">Reassign</button>
                         </div>
                     ))}
                 </div>
             </div>
         </div>

         {/* RIGHT PANEL: Dispatch Action Center (Conditional) */}
         {selectedIncidentId && (
             <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col animate-slide-in-right">
                 <div className="p-4 border-b border-slate-800 bg-blue-900/10">
                     <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Dispatching To</h3>
                     <div className="font-bold text-white text-lg flex items-center gap-2">
                         {selectedIncident?.id}
                         {selectedIncident?.priority === 'CRITICAL' && <AlertTriangle size={16} className="text-red-500 animate-pulse" />}
                     </div>
                     <div className="text-xs text-gray-400 mt-1 truncate">{selectedIncident?.address}</div>
                 </div>

                 <div className="p-4 flex-1 space-y-6">
                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Recommended Response</label>
                         <div className="flex gap-2">
                             <span className="px-2 py-1 bg-slate-800 rounded text-xs text-gray-300 border border-slate-700">2 Police</span>
                             <span className="px-2 py-1 bg-slate-800 rounded text-xs text-gray-300 border border-slate-700">1 Medical</span>
                         </div>
                     </div>

                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Selected Units ({selectedUnits.length})</label>
                         <div className="bg-slate-800 rounded-lg p-2 min-h-[80px] border border-slate-700">
                             {selectedUnits.length > 0 ? (
                                 <div className="flex flex-wrap gap-2">
                                     {selectedUnits.map(uid => (
                                         <span key={uid} className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                             {uid} <button onClick={() => toggleUnitSelection(uid)} className="hover:text-red-200"><X size={12} /></button>
                                         </span>
                                     ))}
                                 </div>
                             ) : (
                                 <div className="text-xs text-gray-500 text-center py-4">Select units from grid</div>
                             )}
                         </div>
                     </div>

                     <div>
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Response Mode</label>
                         <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                             <button 
                                onClick={() => setEmergencyLights(true)}
                                className={`flex-1 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all ${emergencyLights ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                             >
                                 <Siren size={14} /> EMERGENCY
                             </button>
                             <button 
                                onClick={() => setEmergencyLights(false)}
                                className={`flex-1 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all ${!emergencyLights ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                             >
                                 STANDARD
                             </button>
                         </div>
                     </div>

                     <div className="bg-slate-800 rounded p-3 border border-slate-700">
                         <div className="flex justify-between text-xs mb-1">
                             <span className="text-gray-400">Est. Arrival</span>
                             <span className="text-white font-bold">4 mins</span>
                         </div>
                         <div className="flex justify-between text-xs">
                             <span className="text-gray-400">Distance</span>
                             <span className="text-white font-bold">1.2 miles</span>
                         </div>
                     </div>
                 </div>

                 <div className="p-4 border-t border-slate-800">
                     <button 
                        onClick={() => setShowDispatchModal(true)}
                        disabled={selectedUnits.length === 0}
                        className={`w-full py-3 rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all
                            ${selectedUnits.length > 0 ? 'bg-green-600 hover:bg-green-500 text-white transform hover:-translate-y-1' : 'bg-slate-800 text-gray-500 cursor-not-allowed'}
                        `}
                     >
                         <Radio size={16} /> DISPATCH SELECTED
                     </button>
                 </div>
             </div>
         )}
      </div>

      {/* Confirmation Modal */}
      {showDispatchModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
                  <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                          <Radio size={32} />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">Confirm Dispatch?</h2>
                      <p className="text-gray-400 text-sm">
                          Dispatching <span className="text-white font-bold">{selectedUnits.length} units</span> to <span className="text-white font-bold">{selectedIncidentId}</span> with <span className={emergencyLights ? "text-red-400 font-bold" : "text-blue-400 font-bold"}>{emergencyLights ? 'EMERGENCY' : 'STANDARD'}</span> priority.
                      </p>
                  </div>
                  <div className="flex gap-4">
                      <button 
                        onClick={() => setShowDispatchModal(false)}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={() => {
                            setShowDispatchModal(false);
                            onBack(); // Simulate success and return
                        }}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold"
                      >
                          CONFIRM
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DispatchControl;
