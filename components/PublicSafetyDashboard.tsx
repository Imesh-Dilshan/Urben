
import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Flame, Stethoscope, BadgeAlert, 
  MapPin, Clock, Bell, LogOut, Navigation, 
  Filter, MoreVertical, Radio, ChevronDown, ChevronUp, User,
  FileText, Activity, MessageSquare, Briefcase
} from 'lucide-react';
import { Incident, EmergencyUnit, AlertLevel, IncidentPriority, IncidentType, UnitStatus, IncidentStatus, UnitType } from '../types';
import IncidentDetailPage from './IncidentDetailPage';
import BroadcastAlertPage from './BroadcastAlertPage';
import DispatchControl from './DispatchControl';
import CoordinationCenter from './CoordinationCenter';
import SafetyReportsPage from './SafetyReportsPage';

interface PublicSafetyDashboardProps {
  onLogout: () => void;
}

// --- Mock Data Generation ---

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2547',
    type: 'FIRE',
    priority: 'CRITICAL',
    status: 'ACTIVE',
    title: 'Structure Fire',
    description: 'Commercial building fire, smoke visible on 3rd floor. Possible entrapment.',
    address: '452 Industrial Parkway, Zone 4',
    coordinates: { x: 42, y: 35 },
    timestamp: new Date(Date.now() - 12 * 60000), // 12 mins ago
    assignedUnits: ['FIRE-3', 'FIRE-5'],
    caller: '(555) 921-3322'
  },
  {
    id: 'INC-2548',
    type: 'MEDICAL',
    priority: 'HIGH',
    status: 'EN_ROUTE',
    title: 'Cardiac Arrest',
    description: 'Adult male, collapsed, no pulse. CPR in progress by bystander.',
    address: '1200 Main St, Apt 4B, Zone 1',
    coordinates: { x: 65, y: 20 },
    timestamp: new Date(Date.now() - 5 * 60000), // 5 mins ago
    assignedUnits: ['AMB-7'],
    caller: '(555) 112-9988'
  },
  {
    id: 'INC-2549',
    type: 'POLICE',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    title: 'Suspicious Activity',
    description: 'Individual attempting to open vehicle doors in parking structure.',
    address: 'Westside Mall, Zone 2',
    coordinates: { x: 25, y: 60 },
    timestamp: new Date(Date.now() - 18 * 60000),
    assignedUnits: [],
    caller: 'Security Desk'
  },
  {
    id: 'INC-2550',
    type: 'TRAFFIC',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    title: 'Minor Collision',
    description: 'Two vehicle fender bender, no injuries. Blocking right lane.',
    address: 'Hwy 101 Southbound Exit 4',
    coordinates: { x: 80, y: 75 },
    timestamp: new Date(Date.now() - 45 * 60000),
    assignedUnits: ['PD-12'],
  }
];

const INITIAL_UNITS: EmergencyUnit[] = [
  { id: 'PD-12', type: 'POLICE', status: 'ON_SCENE', location: 'Hwy 101 SB', currentAssignment: 'INC-2550', lastUpdate: new Date() },
  { id: 'PD-15', type: 'POLICE', status: 'AVAILABLE', location: 'Zone 1 Patrol', lastUpdate: new Date() },
  { id: 'PD-22', type: 'POLICE', status: 'AVAILABLE', location: 'Zone 3 Patrol', lastUpdate: new Date() },
  { id: 'FIRE-3', type: 'FIRE', status: 'ON_SCENE', location: '452 Industrial Pkwy', currentAssignment: 'INC-2547', lastUpdate: new Date() },
  { id: 'FIRE-5', type: 'FIRE', status: 'ON_SCENE', location: '452 Industrial Pkwy', currentAssignment: 'INC-2547', lastUpdate: new Date() },
  { id: 'FIRE-1', type: 'FIRE', status: 'AVAILABLE', location: 'Station 1', lastUpdate: new Date() },
  { id: 'AMB-7', type: 'AMBULANCE', status: 'EN_ROUTE', location: 'Main St', currentAssignment: 'INC-2548', lastUpdate: new Date() },
  { id: 'AMB-2', type: 'AMBULANCE', status: 'AVAILABLE', location: 'Hospital Base', lastUpdate: new Date() },
];

// --- Helpers ---

const getPriorityColor = (priority: IncidentPriority) => {
  switch (priority) {
    case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'LOW': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  }
};

const getStatusColor = (status: UnitStatus | IncidentStatus) => {
  switch (status) {
    case 'ACTIVE':
    case 'ON_SCENE': return 'text-blue-400 bg-blue-400/20';
    case 'EN_ROUTE': return 'text-yellow-400 bg-yellow-400/20 animate-pulse';
    case 'AVAILABLE':
    case 'RESOLVED': return 'text-green-400 bg-green-400/20';
    case 'OFF_DUTY': return 'text-gray-500 bg-gray-500/20';
    case 'INVESTIGATING': return 'text-purple-400 bg-purple-400/20';
    default: return 'text-gray-400';
  }
};

const getTypeIcon = (type: IncidentType | UnitType) => {
  switch (type) {
    case 'FIRE': return <Flame size={16} />;
    case 'MEDICAL':
    case 'AMBULANCE': return <Stethoscope size={16} />;
    case 'POLICE': return <BadgeAlert size={16} />;
    case 'TRAFFIC': return <Navigation size={16} />;
    case 'HAZARD': return <AlertTriangle size={16} />;
    default: return <Shield size={16} />;
  }
};

// --- Component ---

const PublicSafetyDashboard: React.FC<PublicSafetyDashboardProps> = ({ onLogout }) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'detail' | 'broadcast' | 'dispatch' | 'coordination' | 'reports'>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [units, setUnits] = useState<EmergencyUnit[]>(INITIAL_UNITS);
  const [alertLevel, setAlertLevel] = useState<AlertLevel>('RED');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleIncidentClick = (id: string) => {
      setSelectedIncidentId(id);
  };

  const handleViewDetails = (id: string) => {
      setSelectedIncidentId(id);
      setViewMode('detail');
  };

  const handleBackToDashboard = () => {
      setViewMode('dashboard');
  };

  const handleBroadcastClick = () => {
      setViewMode('broadcast');
  };

  const handleDispatchClick = () => {
      setViewMode('dispatch');
  };
  
  const handleCoordinationClick = () => {
      setViewMode('coordination');
  };

  const handleReportsClick = () => {
      setViewMode('reports');
  };

  // Logic for Detailed Views
  if (viewMode === 'detail' && selectedIncidentId) {
      const selectedIncident = incidents.find(i => i.id === selectedIncidentId);
      if (selectedIncident) {
          return (
              <IncidentDetailPage 
                incident={selectedIncident} 
                allUnits={units}
                onBack={handleBackToDashboard} 
              />
          );
      }
  }

  if (viewMode === 'broadcast') {
      return <BroadcastAlertPage onBack={handleBackToDashboard} />;
  }

  if (viewMode === 'dispatch') {
      return (
        <DispatchControl 
            incidents={incidents}
            units={units}
            onBack={handleBackToDashboard}
        />
      );
  }

  if (viewMode === 'coordination') {
      return <CoordinationCenter onBack={handleBackToDashboard} />;
  }
  
  if (viewMode === 'reports') {
      return <SafetyReportsPage onBack={handleBackToDashboard} />;
  }

  // Filter logic
  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'ALL') return true;
    return inc.priority === filter;
  }).sort((a, b) => {
    // Sort critical first
    const prioScore = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
    return prioScore[b.priority] - prioScore[a.priority];
  });

  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col overflow-hidden">
      
      {/* 1. Command Header */}
      <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-6 shadow-md z-50">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-900 p-2 rounded-lg border border-blue-700">
            <Shield size={24} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-white">PUBLIC SAFETY COMMAND</h1>
            <div className="text-xs text-blue-400 font-mono tracking-widest">URBAN NEXUS v2.4.1</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-4">
           {/* Navigation Buttons */}
           <button 
             onClick={handleCoordinationClick}
             className="bg-slate-700 hover:bg-slate-600 text-blue-300 hover:text-white px-3 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-colors border border-slate-600"
           >
             <MessageSquare size={14} />
             Coordination Tools
           </button>
           
           <button 
             onClick={handleReportsClick}
             className="bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white px-3 py-2 rounded-md font-bold text-xs flex items-center gap-2 transition-colors border border-slate-600"
           >
             <FileText size={14} />
             Reports
           </button>
           
           {/* Digital Clock */}
           <div className="text-center px-4 border-l border-r border-slate-700">
             <div className="text-xl font-mono font-bold text-white leading-none">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
             </div>
             <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })}
             </div>
           </div>
           
           {/* Broadcast Button */}
           <button 
             onClick={handleBroadcastClick}
             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
           >
             <Radio size={16} />
             BROADCAST ALERT
           </button>
        </div>

        <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400">Active Units</span>
                <span className="font-mono text-xl font-bold text-green-400">
                    {units.filter(u => u.status !== 'OFF_DUTY').length}
                </span>
            </div>
            <div className="h-8 w-[1px] bg-slate-600"></div>
            <button className="relative text-gray-400 hover:text-white">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-sm transition-colors"
            >
                <LogOut size={16} />
                <span>Exit</span>
            </button>
        </div>
      </header>

      {/* 2. Critical Status Banner */}
      <div className={`
        w-full py-2 px-6 flex justify-center items-center gap-4 text-sm font-bold tracking-widest shadow-lg z-40 transition-colors duration-500
        ${alertLevel === 'RED' ? 'bg-red-900/90 text-red-100 border-b border-red-700' : 
          alertLevel === 'YELLOW' ? 'bg-yellow-900/90 text-yellow-100 border-b border-yellow-700' : 
          'bg-green-900/90 text-green-100 border-b border-green-700'}
      `}>
        <AlertTriangle size={18} className={alertLevel === 'RED' ? 'animate-pulse' : ''} />
        <span>CONDITION {alertLevel} - {alertLevel === 'RED' ? 'CRITICAL INCIDENTS ACTIVE' : alertLevel === 'YELLOW' ? 'ELEVATED ALERT' : 'ALL CLEAR'}</span>
        <span className="w-[1px] h-4 bg-current opacity-30 mx-2"></span>
        <span className="font-mono">{activeCount} ACTIVE INCIDENTS | {criticalCount} CRITICAL</span>
      </div>

      {/* 3. Main Dashboard Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT: Live Map (Mock) */}
        <div className="w-[60%] bg-[#0f172a] relative overflow-hidden border-r border-slate-700 group">
          {/* Google Map Background */}
          <div className="absolute inset-0 z-0">
               <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.07618163946!2d55.26772671470059!3d25.194147809918988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682f700cf983%3A0xb5cc58b076c0b904!2sBurj%20Khalifa%20-%20Downtown%20Dubai%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2slk!4v1765379128963!5m2!1sen!2slk" 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }} 
                   allowFullScreen 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
          </div>
          
          {/* Map Zones overlay */}
          <div className="absolute top-4 left-4 text-slate-500 font-mono text-xs z-10 bg-black/50 px-2 py-1 rounded">
            SECTOR A: DOWNTOWN
          </div>
          
          {/* Quick Dispatch Shortcut */}
          <button 
             onClick={handleDispatchClick}
             className="absolute top-4 right-4 z-30 bg-blue-600/90 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg backdrop-blur-sm border border-blue-400/50 transition-all"
          >
              <Briefcase size={14} /> Emergency Dispatch
          </button>

          {/* Incident Pins */}
          {incidents.filter(i => i.status !== 'RESOLVED').map((inc) => (
             <button
                key={inc.id}
                onClick={() => handleIncidentClick(inc.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 focus:outline-none z-20 group/pin
                    ${selectedIncidentId === inc.id ? 'scale-125 z-30' : ''}
                `}
                style={{ left: `${inc.coordinates.x}%`, top: `${inc.coordinates.y}%` }}
             >
                {/* Ping Animation for Critical */}
                {inc.priority === 'CRITICAL' && (
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                )}
                
                <div className={`
                    relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2
                    ${inc.priority === 'CRITICAL' ? 'bg-red-600 border-white text-white' : 
                      inc.priority === 'HIGH' ? 'bg-orange-500 border-white text-white' : 
                      'bg-yellow-500 border-white text-black'}
                `}>
                    {getTypeIcon(inc.type)}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs rounded shadow-xl p-2 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none border border-slate-600 z-50">
                    <div className="font-bold mb-1">{inc.id} - {inc.type}</div>
                    <div className="text-slate-300">{inc.address}</div>
                </div>
             </button>
          ))}

           {/* Unit Pins (Mock Positions based on incidents or random) */}
           {units.filter(u => u.status !== 'OFF_DUTY').map((unit, idx) => (
               <div 
                key={unit.id}
                className="absolute w-4 h-4 rounded-full bg-blue-500 border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white z-10"
                style={{ 
                    // Simple mock positioning logic for visual variety
                    left: unit.currentAssignment 
                        ? `${(incidents.find(i => i.id === unit.currentAssignment)?.coordinates.x || 50) + (idx % 2 === 0 ? 2 : -2)}%` 
                        : `${20 + idx * 10}%`,
                    top: unit.currentAssignment 
                        ? `${(incidents.find(i => i.id === unit.currentAssignment)?.coordinates.y || 50) + (idx % 2 === 0 ? 2 : -2)}%` 
                        : `${80 - idx * 5}%` 
                }}
               >
                   <div className="absolute -bottom-4 bg-black/50 px-1 rounded text-[8px] whitespace-nowrap">{unit.id}</div>
               </div>
           ))}

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="bg-slate-800 p-2 rounded text-white border border-slate-600 hover:bg-slate-700 shadow-lg"><ChevronUp size={20} /></button>
            <button className="bg-slate-800 p-2 rounded text-white border border-slate-600 hover:bg-slate-700 shadow-lg"><ChevronDown size={20} /></button>
          </div>
          <div className="absolute bottom-6 left-6 bg-slate-800/90 p-3 rounded border border-slate-600 backdrop-blur-sm">
             <div className="text-xs font-bold text-gray-400 mb-2 uppercase">Map Layers</div>
             <div className="flex gap-2 text-xs">
                 <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-500" /> Incidents</label>
                 <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="accent-blue-500" /> Units</label>
                 <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="accent-blue-500" /> Heatmap</label>
             </div>
          </div>
        </div>

        {/* RIGHT: Incident Feed */}
        <div className="w-[40%] bg-slate-900 flex flex-col border-l border-slate-800">
            {/* Feed Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-white">ACTIVE INCIDENTS</h2>
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">{activeCount}</span>
                </div>
                <div className="flex gap-2">
                     {(['ALL', 'CRITICAL', 'HIGH'] as const).map(f => (
                         <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`text-xs px-3 py-1 rounded font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
                         >
                             {f}
                         </button>
                     ))}
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filteredIncidents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <div className="p-4 bg-green-500/10 rounded-full text-green-500">
                             <Shield size={48} />
                        </div>
                        <p>All Clear - No incidents matching filter</p>
                    </div>
                ) : (
                    filteredIncidents.map(incident => (
                        <div 
                            key={incident.id}
                            className={`
                                relative bg-slate-800 rounded-lg p-4 border-l-4 cursor-pointer transition-all hover:bg-slate-750 hover:shadow-lg
                                ${selectedIncidentId === incident.id ? 'ring-1 ring-blue-500 bg-slate-750' : 'border-slate-700'}
                                ${incident.priority === 'CRITICAL' ? 'border-l-red-500' : incident.priority === 'HIGH' ? 'border-l-orange-500' : 'border-l-yellow-500'}
                            `}
                            onClick={() => handleIncidentClick(incident.id)}
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-gray-400">{incident.id}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getPriorityColor(incident.priority)}`}>
                                        {incident.priority}
                                    </span>
                                    {incident.status !== 'ACTIVE' && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getStatusColor(incident.status)}`}>
                                            {incident.status}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {Math.floor((new Date().getTime() - incident.timestamp.getTime()) / 60000)}m ago
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="flex items-start gap-3 mb-3">
                                <div className={`mt-1 p-2 rounded-lg ${incident.type === 'FIRE' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {getTypeIcon(incident.type)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">{incident.title}</h3>
                                    <div className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                                        <MapPin size={12} />
                                        {incident.address}
                                    </div>
                                    <p className="text-gray-300 text-xs mt-2 line-clamp-2">{incident.description}</p>
                                </div>
                            </div>

                            {/* Card Footer: Units & Actions */}
                            <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                                <div className="flex -space-x-2">
                                    {incident.assignedUnits.length > 0 ? (
                                        incident.assignedUnits.map(uid => (
                                            <div key={uid} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[8px] text-white font-mono z-10" title={uid}>
                                                {uid.split('-')[0]}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-xs text-red-400 font-bold animate-pulse">NO UNITS ASSIGNED</span>
                                    )}
                                </div>
                                
                                {incident.assignedUnits.length === 0 ? (
                                    <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shadow-sm">
                                        DISPATCH
                                    </button>
                                ) : (
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent card click
                                        handleViewDetails(incident.id);
                                      }}
                                      className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 hover:underline"
                                    >
                                        DETAILS <ChevronDown size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      {/* 4. Bottom Unit Status Board */}
      <div className="h-48 bg-slate-900 border-t border-slate-800 flex flex-col">
          <div className="px-4 py-2 bg-slate-800 flex justify-between items-center">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emergency Unit Status</h3>
               <div className="flex gap-4 text-xs text-gray-500 font-mono">
                   <span>AVAILABLE: <span className="text-green-400 font-bold">{units.filter(u => u.status === 'AVAILABLE').length}</span></span>
                   <span>DEPLOYED: <span className="text-blue-400 font-bold">{units.filter(u => ['ON_SCENE', 'EN_ROUTE'].includes(u.status)).length}</span></span>
               </div>
          </div>
          <div className="flex-1 overflow-x-auto p-4 custom-scrollbar">
               <div className="flex gap-3 min-w-max">
                   {units.map(unit => (
                       <div key={unit.id} className="w-48 bg-slate-800 border border-slate-700 rounded p-3 flex flex-col gap-2 hover:border-slate-600 transition-colors">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-white">{unit.id}</span>
                                    <span className="text-gray-500">{getTypeIcon(unit.type)}</span>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${
                                    unit.status === 'AVAILABLE' ? 'bg-green-500' :
                                    unit.status === 'EN_ROUTE' ? 'bg-yellow-500 animate-pulse' :
                                    unit.status === 'ON_SCENE' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}></div>
                            </div>
                            <div className="text-xs font-mono text-gray-400 truncate">
                                {unit.status === 'AVAILABLE' ? 'PATROLLING' : unit.currentAssignment || 'STANDBY'}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-auto flex justify-between">
                                <span>{unit.location}</span>
                                <span>{unit.lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                            </div>
                       </div>
                   ))}
               </div>
          </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569; 
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b; 
        }
      `}</style>
    </div>
  );
};

export default PublicSafetyDashboard;
