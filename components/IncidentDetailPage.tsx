
import React, { useState } from 'react';
import { 
  ArrowLeft, Clock, MapPin, Phone, Shield, 
  AlertTriangle, Siren, FileText, Printer, 
  MessageSquare, Mic, Users, ChevronRight,
  Send, Image as ImageIcon, Video, History
} from 'lucide-react';
import { Incident, EmergencyUnit, IncidentUpdate, IncidentNote } from '../types';

interface IncidentDetailPageProps {
  incident: Incident;
  allUnits: EmergencyUnit[];
  onBack: () => void;
}

// Helper for status colors (reused)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'RESOLVED': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const IncidentDetailPage: React.FC<IncidentDetailPageProps> = ({ incident, allUnits, onBack }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'media' | 'reports'>('timeline');
  const [noteInput, setNoteInput] = useState('');

  // Mock Timeline Data
  const [updates, setUpdates] = useState<IncidentUpdate[]>([
    { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 15), text: 'Incident reported via 911 call.', source: 'System', type: 'INFO' },
    { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 12), text: `Units ${incident.assignedUnits.join(', ')} dispatched to scene.`, source: 'Command', type: 'STATUS_CHANGE' },
    { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 8), text: 'First responders arrived on scene.', source: 'FIRE-3', type: 'INFO' },
    { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 2), text: 'Requesting additional backup for traffic control.', source: 'PD-12', type: 'ALERT' },
  ]);

  const assignedUnitDetails = allUnits.filter(u => incident.assignedUnits.includes(u.id));

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const newUpdate: IncidentUpdate = {
      id: Date.now().toString(),
      timestamp: new Date(),
      text: noteInput,
      source: 'Command',
      type: 'INFO'
    };
    setUpdates([newUpdate, ...updates]);
    setNoteInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      {/* 1. Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-8xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center text-xs text-gray-400 mb-2 space-x-2">
            <span className="cursor-pointer hover:text-white" onClick={onBack}>Command Center</span>
            <ChevronRight size={12} />
            <span>Active Incidents</span>
            <ChevronRight size={12} />
            <span className="text-blue-400 font-mono">{incident.id}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                   {incident.type === 'FIRE' ? <span className="text-red-500">🔥</span> : 
                    incident.type === 'MEDICAL' ? <span className="text-blue-500">🚑</span> : 
                    incident.type === 'POLICE' ? <span className="text-blue-400">🚓</span> : '⚠️'}
                   {incident.title}
                   <span className="text-gray-500 font-normal mx-2">|</span>
                   <span className="text-lg font-mono text-gray-300">{incident.address}</span>
                </h1>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-sm bg-slate-700 px-2 py-0.5 rounded text-gray-300">{incident.id}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStatusColor(incident.priority)}`}>
                  {incident.priority} PRIORITY
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
                   <Clock size={12} /> 
                   Reported: {incident.timestamp.toLocaleTimeString()} ({Math.floor((Date.now() - incident.timestamp.getTime())/60000)}m ago)
                </span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
               <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors">
                  <AlertTriangle size={16} /> Escalate
               </button>
               <button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors">
                  <Siren size={16} /> Backup
               </button>
               <select className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-bold border-none outline-none cursor-pointer transition-colors">
                  <option>Update Status</option>
                  <option>Contained</option>
                  <option>Resolved</option>
                  <option>Investigating</option>
               </select>
               <button className="bg-slate-700 hover:bg-slate-600 text-gray-300 p-2 rounded transition-colors" title="Print Report">
                  <Printer size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Critical Banner */}
      {incident.priority === 'CRITICAL' && (
        <div className="bg-red-900/90 border-b border-red-700 text-red-100 px-6 py-3 flex items-center justify-center gap-3 animate-pulse">
            <AlertTriangle size={20} />
            <span className="font-bold tracking-widest">CRITICAL INCIDENT ACTIVE - ALL HANDS ALERT</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-8xl mx-auto">
             
             {/* LEFT COLUMN: Overview (3 cols) */}
             <div className="lg:col-span-3 space-y-6">
                {/* Incident Info Card */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                   <div className="bg-slate-900/50 p-3 border-b border-slate-700 font-bold text-gray-300 text-sm">
                      INCIDENT OVERVIEW
                   </div>
                   <div className="p-4 space-y-4">
                      <div>
                         <label className="text-xs text-gray-500 uppercase font-bold">Type Category</label>
                         <div className="text-white font-medium flex items-center gap-2">
                            {incident.type} <span className="text-xs bg-slate-700 px-1 rounded text-gray-400">Code 10-45</span>
                         </div>
                      </div>
                      <div>
                         <label className="text-xs text-gray-500 uppercase font-bold">Location</label>
                         <div className="text-white font-medium">{incident.address}</div>
                         <div className="text-xs text-blue-400 mt-1">Zone 4 • District 2</div>
                         {/* Mini Map */}
                         <div className="mt-2 h-48 w-full bg-slate-700 rounded-lg relative overflow-hidden group">
                             <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.07618163946!2d55.26772671470059!3d25.194147809918988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682f700cf983%3A0xb5cc58b076c0b904!2sBurj%20Khalifa%20-%20Downtown%20Dubai%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2slk!4v1765379128963!5m2!1sen!2slk" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                 <MapPin className="text-red-500 drop-shadow-lg animate-bounce" size={32} />
                            </div>
                         </div>
                      </div>
                      <div>
                         <label className="text-xs text-gray-500 uppercase font-bold">Reporter</label>
                         <div className="text-white font-medium">{incident.caller || 'Anonymous'}</div>
                         <div className="text-xs text-gray-400 flex items-center gap-1">
                             <Phone size={10} /> (555) ***-**99
                         </div>
                         <div className="text-xs text-gray-500 mt-1">Method: 911 Cellular</div>
                      </div>
                      <div>
                         <label className="text-xs text-gray-500 uppercase font-bold">Affected Radius</label>
                         <div className="text-white font-medium">~500 ft</div>
                      </div>
                   </div>
                </div>

                {/* Additional Info */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                   <h3 className="font-bold text-gray-300 text-sm mb-3">ENVIRONMENTAL</h3>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                          <div className="text-gray-500 text-xs">Wind</div>
                          <div className="text-white">NW 12mph</div>
                      </div>
                      <div>
                          <div className="text-gray-500 text-xs">Temp</div>
                          <div className="text-white">72°F</div>
                      </div>
                      <div>
                          <div className="text-gray-500 text-xs">Visibility</div>
                          <div className="text-white">Clear</div>
                      </div>
                      <div>
                          <div className="text-gray-500 text-xs">Humidity</div>
                          <div className="text-white">45%</div>
                      </div>
                   </div>
                </div>
             </div>

             {/* CENTER COLUMN: Feed (6 cols) */}
             <div className="lg:col-span-6 flex flex-col gap-6">
                {/* Timeline Header & Tabs */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col h-[600px]">
                   <div className="flex border-b border-slate-700">
                      <button 
                        onClick={() => setActiveTab('timeline')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-blue-500 text-blue-400 bg-slate-700/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                      >
                         Live Updates
                      </button>
                      <button 
                        onClick={() => setActiveTab('media')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'media' ? 'border-blue-500 text-blue-400 bg-slate-700/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                      >
                         Media (0)
                      </button>
                      <button 
                        onClick={() => setActiveTab('reports')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'reports' ? 'border-blue-500 text-blue-400 bg-slate-700/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                      >
                         Reports
                      </button>
                   </div>

                   {/* Timeline Content */}
                   {activeTab === 'timeline' && (
                     <div className="flex-1 flex flex-col relative">
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                           {/* Add Update Button (Placeholder for top) */}
                           
                           {updates.map((update, idx) => (
                              <div key={update.id} className="flex gap-4 group">
                                 <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${update.type === 'ALERT' ? 'bg-red-500' : update.type === 'STATUS_CHANGE' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                                    {idx !== updates.length - 1 && <div className="w-0.5 bg-slate-700 flex-1 mt-1"></div>}
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                       <span className="text-xs font-mono text-gray-500">{update.timestamp.toLocaleTimeString()}</span>
                                       <span className="text-xs font-bold text-gray-400 bg-slate-900 px-2 rounded-full">{update.source}</span>
                                    </div>
                                    <div className={`mt-1 text-sm ${update.type === 'ALERT' ? 'text-red-300 font-medium' : 'text-gray-300'}`}>
                                       {update.text}
                                    </div>
                                 </div>
                              </div>
                           ))}
                           
                           {/* Start Marker */}
                           <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                 <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                              </div>
                              <div className="text-sm text-green-500 font-mono">INCIDENT STARTED</div>
                           </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-800 border-t border-slate-700">
                           <div className="relative">
                              <input 
                                type="text" 
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                placeholder="Add command note or update..." 
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                              />
                              <button 
                                onClick={handleAddNote}
                                className="absolute right-2 top-2 p-1.5 text-blue-400 hover:text-white rounded hover:bg-slate-700"
                              >
                                 <Send size={18} />
                              </button>
                           </div>
                           <div className="flex gap-2 mt-2">
                              <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
                                 <Mic size={12} /> Voice Note
                              </button>
                              <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
                                 <ImageIcon size={12} /> Attach Photo
                              </button>
                           </div>
                        </div>
                     </div>
                   )}
                   
                   {activeTab === 'media' && (
                       <div className="flex-1 flex items-center justify-center flex-col text-gray-500 p-8">
                           <ImageIcon size={48} className="mb-4 opacity-50" />
                           <p>No media uploaded yet.</p>
                           <button className="mt-4 px-4 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">Upload Evidence</button>
                       </div>
                   )}

                    {activeTab === 'reports' && (
                       <div className="flex-1 p-6 space-y-4">
                           <div className="flex items-center justify-between p-4 bg-slate-900 rounded border border-slate-700">
                               <div className="flex items-center gap-3">
                                   <FileText className="text-blue-400" />
                                   <div>
                                       <div className="text-white font-medium text-sm">Preliminary Incident Report</div>
                                       <div className="text-xs text-gray-500">Generated automatically on creation</div>
                                   </div>
                               </div>
                               <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded">Download</button>
                           </div>
                           <button className="w-full py-2 border border-dashed border-gray-600 text-gray-400 rounded hover:bg-slate-700 hover:text-white transition-colors text-sm">
                               + Generate New Report
                           </button>
                       </div>
                   )}
                </div>
             </div>

             {/* RIGHT COLUMN: Resources (3 cols) */}
             <div className="lg:col-span-3 space-y-6">
                 {/* Assigned Units */}
                 <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    <div className="bg-slate-900/50 p-3 border-b border-slate-700 flex justify-between items-center">
                        <span className="font-bold text-gray-300 text-sm">ASSIGNED UNITS ({assignedUnitDetails.length})</span>
                        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">+ Request</button>
                    </div>
                    <div className="divide-y divide-slate-700">
                        {assignedUnitDetails.map(unit => (
                            <div key={unit.id} className="p-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold border ${
                                        unit.type === 'FIRE' ? 'bg-red-900/50 border-red-800 text-red-200' :
                                        unit.type === 'POLICE' ? 'bg-blue-900/50 border-blue-800 text-blue-200' :
                                        'bg-orange-900/50 border-orange-800 text-orange-200'
                                    }`}>
                                        {unit.id.split('-')[0]}
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-medium">{unit.id}</div>
                                        <div className={`text-[10px] font-bold ${
                                            unit.status === 'ON_SCENE' ? 'text-blue-400' : 
                                            unit.status === 'EN_ROUTE' ? 'text-yellow-400 animate-pulse' : 'text-gray-400'
                                        }`}>
                                            {unit.status.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1.5 rounded hover:bg-slate-600 text-gray-400 hover:text-white" title="Message">
                                        <MessageSquare size={14} />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-slate-600 text-gray-400 hover:text-white" title="Radio">
                                        <Mic size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {assignedUnitDetails.length === 0 && (
                            <div className="p-4 text-center text-gray-500 text-sm italic">
                                No units currently assigned.
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Comm Panel */}
                 <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                     <h3 className="font-bold text-gray-300 text-sm mb-3">COMMUNICATIONS</h3>
                     <div className="space-y-2">
                         <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm flex items-center justify-center gap-2">
                             <Users size={16} /> Broadcast to Assigned
                         </button>
                         <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm flex items-center justify-center gap-2">
                             <Phone size={16} /> Conference Bridge
                         </button>
                     </div>
                 </div>
                 
                 {/* Related Incidents */}
                 <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                     <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-300 text-sm">HISTORY AT LOCATION</h3>
                        <History size={14} className="text-gray-500" />
                     </div>
                     <div className="text-xs text-gray-400">
                         <p className="mb-2">2 prior incidents in last 30 days.</p>
                         <div className="pl-2 border-l-2 border-slate-600 space-y-2">
                            <div>
                                <div className="text-gray-300">Medical Assist</div>
                                <div className="text-gray-500">2 weeks ago • Resolved</div>
                            </div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="bg-slate-800 border-t border-slate-700 p-3 z-40">
          <div className="max-w-8xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Last saved: Just now</span>
                  <span>Session ID: #CMD-9921</span>
              </div>
              <div className="flex items-center gap-3">
                  <button onClick={onBack} className="text-gray-400 hover:text-white text-sm font-medium">Back to Dashboard</button>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold text-sm shadow-lg shadow-blue-500/20">
                      Save & Close
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default IncidentDetailPage;
