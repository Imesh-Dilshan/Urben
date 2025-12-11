
import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, Flame, CloudRain, ShieldAlert, 
  Stethoscope, Megaphone, BellRing, Map, Navigation, Globe, 
  Smartphone, ChevronRight, X, Lock, History, BarChart3, 
  FileText, Send, Save
} from 'lucide-react';
import { AlertType, AlertPriority, AlertTemplate, BroadcastLog } from '../types';

interface BroadcastAlertPageProps {
  onBack: () => void;
}

// --- Mock Data ---

const TEMPLATES: AlertTemplate[] = [
  { id: '1', label: 'Shelter in Place', type: 'POLICE', priority: 'CRITICAL', message: 'EMERGENCY: Police activity in your area. Shelter in place immediately. Lock all doors and windows. Do not go outside.' },
  { id: '2', label: 'Evacuation Order', type: 'FIRE', priority: 'CRITICAL', message: 'EVACUATION ORDER: Immediate threat to life safety due to [Hazards]. Evacuate Zone [X] immediately via [Route].' },
  { id: '3', label: 'Severe Weather', type: 'WEATHER', priority: 'HIGH', message: 'SEVERE WEATHER ALERT: Tornado warning issued for your area until [Time]. Seek shelter in a basement or interior room now.' },
  { id: '4', label: 'Road Closure', type: 'TRAFFIC', priority: 'MEDIUM', message: 'TRAFFIC ALERT: Major accident on [Road Name]. All lanes closed. Expect heavy delays. Use alternate routes.' } as any, // Cast for Traffic type
  { id: '5', label: 'All Clear', type: 'GENERAL', priority: 'LOW', message: 'ALL CLEAR: The emergency situation in your area has been resolved. It is safe to resume normal activities.' },
];

const RECENT_LOGS: BroadcastLog[] = [
  { id: 'BC-1024', type: 'WEATHER', priority: 'HIGH', message: 'Flash flood warning for Downtown Sector.', timestamp: new Date(Date.now() - 3600000 * 2), recipients: 12500, status: 'SENT' },
  { id: 'BC-1023', type: 'POLICE', priority: 'MEDIUM', message: 'BOLO: Suspect vehicle spotted near Main St.', timestamp: new Date(Date.now() - 3600000 * 24), recipients: 450, status: 'SENT' },
  { id: 'BC-1022', type: 'GENERAL', priority: 'LOW', message: 'Public utility maintenance scheduled.', timestamp: new Date(Date.now() - 3600000 * 48), recipients: 5000, status: 'SENT' },
];

const BroadcastAlertPage: React.FC<BroadcastAlertPageProps> = ({ onBack }) => {
  const [step, setStep] = useState<'create' | 'confirm' | 'success'>('create');
  const [selectedType, setSelectedType] = useState<AlertType | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<AlertPriority>('MEDIUM');
  const [targetMode, setTargetMode] = useState<'ZONE' | 'RADIUS' | 'CITY'>('ZONE');
  const [message, setMessage] = useState('');
  const [pin, setPin] = useState('');
  const [confirmationInput, setConfirmationInput] = useState('');

  const handleTemplateSelect = (template: AlertTemplate) => {
    setSelectedType(template.type);
    setSelectedPriority(template.priority);
    setMessage(template.message);
  };

  const handleBroadcast = () => {
    if (selectedPriority === 'CRITICAL' && pin !== '1234') {
      alert('Invalid PIN');
      return;
    }
    setStep('success');
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'FIRE': return <Flame size={32} />;
      case 'WEATHER': return <CloudRain size={32} />;
      case 'POLICE': return <ShieldAlert size={32} />;
      case 'MEDICAL': return <Stethoscope size={32} />;
      case 'SAFETY': return <AlertTriangle size={32} />;
      default: return <Megaphone size={32} />;
    }
  };

  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-600 border-red-500 text-white shadow-red-500/50';
      case 'HIGH': return 'bg-orange-500 border-orange-400 text-white shadow-orange-500/50';
      case 'MEDIUM': return 'bg-yellow-500 border-yellow-400 text-black shadow-yellow-500/50';
      case 'LOW': return 'bg-green-500 border-green-400 text-white shadow-green-500/50';
    }
  };

  // --- SUCCESS VIEW ---
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl max-w-lg w-full text-center border border-slate-700 shadow-2xl">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Broadcast Sent Successfully</h2>
          <p className="text-gray-400 mb-8">
            Alert ID <span className="font-mono text-white">#BC-{Math.floor(Math.random() * 10000)}</span> has been dispatched to <span className="font-bold text-white">14,203</span> recipients.
          </p>
          
          <div className="space-y-3">
             <button onClick={onBack} className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-bold transition-colors">
               Return to Dashboard
             </button>
             <button onClick={() => setStep('create')} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition-colors">
               Send Another Alert
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- CONFIRMATION VIEW ---
  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 max-w-3xl w-full rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Left: Summary */}
            <div className="p-8 md:w-2/3 space-y-6">
                <div className="flex items-center gap-3 text-red-500 mb-2">
                    <AlertTriangle size={24} className="animate-pulse" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Confirm Broadcast</h2>
                </div>
                
                <div className="space-y-4 text-sm">
                    <div className="bg-slate-900 p-4 rounded border border-slate-700">
                        <label className="block text-gray-500 text-xs font-bold uppercase mb-1">Alert Type & Priority</label>
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(selectedPriority)}`}>{selectedPriority}</span>
                            <span className="font-bold text-lg">{selectedType} EMERGENCY</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded border border-slate-700">
                        <label className="block text-gray-500 text-xs font-bold uppercase mb-1">Target Audience</label>
                        <div className="font-mono text-lg">~14,200 Citizens</div>
                        <div className="text-gray-400 text-xs">Method: {targetMode} Selection</div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded border border-slate-700">
                        <label className="block text-gray-500 text-xs font-bold uppercase mb-1">Message Preview</label>
                        <p className="font-medium text-white italic">"{message}"</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                     {selectedPriority === 'CRITICAL' && (
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-red-400 mb-1">ENTER AUTHORIZATION PIN</label>
                            <input 
                                type="password" 
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="bg-slate-900 border border-red-900/50 text-white px-3 py-2 rounded w-32 focus:outline-none focus:border-red-500 text-center tracking-widest"
                                placeholder="••••"
                            />
                        </div>
                     )}
                     
                     <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-400 mb-1">TYPE "CONFIRM" TO PROCEED</label>
                        <input 
                            type="text" 
                            value={confirmationInput}
                            onChange={(e) => setConfirmationInput(e.target.value.toUpperCase())}
                            className="bg-slate-900 border border-slate-600 text-white px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500 uppercase"
                            placeholder="CONFIRM"
                        />
                     </div>

                     <div className="flex gap-4">
                        <button onClick={() => setStep('create')} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded font-bold text-gray-300">
                            Cancel
                        </button>
                        <button 
                            onClick={handleBroadcast}
                            disabled={confirmationInput !== 'CONFIRM'}
                            className={`flex-1 py-3 rounded font-bold text-white transition-all
                                ${confirmationInput === 'CONFIRM' ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20' : 'bg-slate-700 opacity-50 cursor-not-allowed'}
                            `}
                        >
                            BROADCAST ALERT
                        </button>
                     </div>
                </div>
            </div>

            {/* Right: Mobile Preview */}
            <div className="bg-slate-900 p-8 md:w-1/3 border-l border-slate-800 flex items-center justify-center">
                <div className="w-64 border-4 border-slate-700 rounded-3xl bg-black overflow-hidden relative shadow-2xl">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                    
                    {/* Screen */}
                    <div className="h-[500px] bg-slate-800 pt-10 px-4 relative">
                        {/* Lock Screen Notification */}
                        <div className="bg-gray-200/95 rounded-xl p-4 shadow-lg backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                                        <AlertTriangle size={12} className="text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800 uppercase">Emergency Alert</span>
                                </div>
                                <span className="text-[10px] text-gray-500">now</span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900 mb-1">{selectedType} ALERT</h4>
                            <p className="text-xs text-gray-700 leading-snug">{message}</p>
                        </div>

                        {/* Background Elements */}
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 text-gray-500">
                             <div className="text-4xl font-thin text-white">12:42</div>
                             <div className="text-xs">Tuesday, October 24</div>
                             <div className="flex gap-4 mt-8">
                                <div className="w-10 h-10 rounded-full bg-slate-700/50"></div>
                                <div className="w-10 h-10 rounded-full bg-slate-700/50"></div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- CREATE VIEW (Main) ---
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-red-900/20 border-b border-red-900/50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div className="flex items-center gap-3 text-red-500">
                 <AlertTriangle size={24} className="animate-pulse" />
                 <h1 className="text-lg font-bold tracking-widest uppercase">Alert Broadcasting Center <span className="text-xs opacity-70 ml-2 text-gray-400 normal-case tracking-normal">– Authorized Use Only</span></h1>
             </div>
             <div className="flex items-center gap-4 text-sm">
                 <div className="text-gray-400">
                    <span className="font-bold text-gray-200">Officer J. Doe</span> • ID: 8842-A
                 </div>
                 <button onClick={onBack} className="p-2 hover:bg-red-900/30 rounded-full transition-colors">
                     <X size={20} />
                 </button>
             </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Main Form Area */}
         <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* 1. Alert Type */}
                <section className="animate-fade-in-up">
                    <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 flex items-center gap-2">
                        <span className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-white border border-slate-600">1</span>
                        Select Alert Type
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {(['FIRE', 'WEATHER', 'POLICE', 'MEDICAL', 'SAFETY', 'GENERAL'] as AlertType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`
                                    flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                                    ${selectedType === type 
                                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10 scale-105' 
                                        : 'bg-slate-900/50 border-slate-700 text-gray-400 hover:border-slate-500 hover:bg-slate-800'
                                    }
                                `}
                            >
                                {getTypeIcon(type)}
                                <span className="mt-2 text-xs font-bold">{type}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. Priority */}
                <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 flex items-center gap-2">
                        <span className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-white border border-slate-600">2</span>
                        Alert Priority
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as AlertPriority[]).map(priority => (
                            <button
                                key={priority}
                                onClick={() => setSelectedPriority(priority)}
                                className={`
                                    relative py-3 px-4 rounded-lg font-bold text-sm border-2 text-left transition-all
                                    ${selectedPriority === priority 
                                        ? getPriorityColor(priority) + ' shadow-lg scale-105' 
                                        : 'bg-slate-900 border-slate-700 text-gray-400 opacity-60 hover:opacity-100'
                                    }
                                `}
                            >
                                {priority === 'CRITICAL' && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                                {priority} PRIORITY
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. Target Area */}
                <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 flex items-center gap-2">
                        <span className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-white border border-slate-600">3</span>
                        Target Area
                    </h3>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                        <div className="flex gap-2 mb-4 border-b border-slate-700 pb-2">
                             <button onClick={() => setTargetMode('ZONE')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${targetMode === 'ZONE' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}>
                                 <Map size={16} /> Zone Select
                             </button>
                             <button onClick={() => setTargetMode('RADIUS')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${targetMode === 'RADIUS' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}>
                                 <Navigation size={16} /> Radius
                             </button>
                             <button onClick={() => setTargetMode('CITY')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${targetMode === 'CITY' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white'}`}>
                                 <Globe size={16} /> Citywide
                             </button>
                        </div>
                        
                        {/* Mock Map Area */}
                        <div className="h-48 bg-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-700 group cursor-crosshair">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.07618163946!2d55.26772671470059!3d25.194147809918988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682f700cf983%3A0xb5cc58b076c0b904!2sBurj%20Khalifa%20-%20Downtown%20Dubai%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2slk!4v1765379128963!5m2!1sen!2slk" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, opacity: 0.6 }} // Slight opacity to make overlays visible
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            {targetMode === 'ZONE' && (
                                <div className="grid grid-cols-2 gap-4 w-full h-full p-4 absolute inset-0">
                                     <div className="bg-blue-500/20 border-2 border-blue-500 rounded flex items-center justify-center text-blue-400 font-bold text-xs hover:bg-blue-500/40 cursor-pointer">ZONE A (Selected)</div>
                                     <div className="bg-slate-700/20 border border-slate-600 rounded flex items-center justify-center text-gray-500 font-bold text-xs hover:bg-slate-700/40 cursor-pointer">ZONE B</div>
                                </div>
                            )}
                            {targetMode === 'RADIUS' && (
                                <div className="w-32 h-32 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-400 text-xs font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                    2.5 Mile Radius
                                </div>
                            )}
                            {targetMode === 'CITY' && (
                                <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                                    <span className="bg-red-900/80 text-white px-4 py-2 rounded font-bold border border-red-500">CITYWIDE BROADCAST SELECTED</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-2 text-right text-xs text-gray-400">
                            Estimated Reach: <span className="text-white font-bold">14,203 Citizens</span>
                        </div>
                    </div>
                </section>

                {/* 4. Message */}
                <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <h3 className="text-gray-400 font-bold uppercase text-xs mb-4 flex items-center gap-2">
                        <span className="bg-slate-800 w-6 h-6 rounded-full flex items-center justify-center text-white border border-slate-600">4</span>
                        Compose Message
                    </h3>
                    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">Alert Text</label>
                            <span className={`text-xs ${message.length > 450 ? 'text-red-400' : 'text-gray-500'}`}>{message.length} / 500 chars</span>
                        </div>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type urgent alert message here..."
                            className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Quick Templates</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                {TEMPLATES.map(template => (
                                    <button 
                                        key={template.id}
                                        onClick={() => handleTemplateSelect(template)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-full text-xs text-gray-300 transition-colors"
                                    >
                                        {template.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="pt-8 pb-12 flex gap-4">
                     <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-gray-300 font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                         <Save size={18} /> Save Draft
                     </button>
                     <button 
                        onClick={() => setStep('confirm')}
                        disabled={!selectedType || !message}
                        className={`
                            flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all
                            ${!selectedType || !message 
                                ? 'bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700' 
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 transform hover:-translate-y-1'
                            }
                        `}
                     >
                         <Send size={20} /> REVIEW & BROADCAST
                     </button>
                </div>
            </div>
         </div>

         {/* Right Sidebar */}
         <div className="w-80 bg-slate-900 border-l border-slate-800 hidden xl:flex flex-col">
             <div className="p-4 border-b border-slate-800">
                 <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                     <History size={16} /> Recent Broadcasts
                 </h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {RECENT_LOGS.map(log => (
                     <div key={log.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPriorityColor(log.priority)} bg-opacity-20`}>{log.priority}</span>
                             <span className="text-[10px] text-gray-500">{log.timestamp.toLocaleDateString()}</span>
                         </div>
                         <div className="font-bold text-sm text-gray-300 mb-1">{log.type} ALERT</div>
                         <p className="text-xs text-gray-500 line-clamp-2 mb-2">{log.message}</p>
                         <div className="flex items-center gap-1 text-[10px] text-blue-400">
                             <CheckCircle size={10} /> Sent to {log.recipients.toLocaleString()}
                         </div>
                     </div>
                 ))}
             </div>
             <div className="p-4 border-t border-slate-800 bg-slate-900">
                 <div className="bg-slate-800 rounded p-3 mb-3">
                     <h4 className="text-xs text-gray-500 font-bold uppercase mb-2">Monthly Stats</h4>
                     <div className="flex justify-between items-end">
                         <div className="text-2xl font-bold text-white">47</div>
                         <BarChart3 className="text-blue-500" size={20} />
                     </div>
                     <div className="text-xs text-gray-400">Alerts sent this month</div>
                 </div>
                 <button className="w-full text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 py-2">
                     <FileText size={12} /> View Full Logs
                 </button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default BroadcastAlertPage;
