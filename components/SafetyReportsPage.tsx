
import React, { useState } from 'react';
import { 
  FileText, ClipboardList, Clock, BarChart3, Download, Plus, 
  Search, Filter, Eye, Trash2, Save, FileCheck, X, UploadCloud,
  ChevronRight, Calendar, User, MapPin, AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { SafetyReport, ReportTemplate, ReportType } from '../types';

interface SafetyReportsPageProps {
  onBack: () => void;
}

// --- Mock Data ---

const MOCK_REPORTS: SafetyReport[] = [
  { id: 'RPT-2024-089', incidentRef: 'INC-2547', title: 'Structure Fire - Industrial Pkwy', type: 'INCIDENT', author: 'Capt. Miller', dateCreated: new Date(Date.now() - 86400000 * 1), status: 'FINAL' },
  { id: 'RPT-2024-088', incidentRef: 'INC-2542', title: 'Traffic Collision - Hwy 101', type: 'INCIDENT', author: 'Ofc. Stevens', dateCreated: new Date(Date.now() - 86400000 * 2), status: 'FINAL' },
  { id: 'RPT-2024-087', title: 'Daily Shift Log - Zone 4', type: 'DAILY_ACTIVITY', author: 'Lt. Johnson', dateCreated: new Date(Date.now() - 86400000 * 3), status: 'FINAL' },
  { id: 'RPT-2024-086', incidentRef: 'INC-2530', title: 'Medical Emergency - Downtown', type: 'INCIDENT', author: 'Medic Sara J.', dateCreated: new Date(), status: 'DRAFT' },
];

const MOCK_TEMPLATES: ReportTemplate[] = [
  { id: 'TMP-001', name: 'Standard Incident Report', type: 'INCIDENT', lastUsed: new Date() },
  { id: 'TMP-002', name: 'Medical Patient Care', type: 'INCIDENT', lastUsed: new Date(Date.now() - 86400000 * 5) },
  { id: 'TMP-003', name: 'Daily Patrol Log', type: 'DAILY_ACTIVITY', lastUsed: new Date(Date.now() - 86400000 * 1) },
  { id: 'TMP-004', name: 'Major Event After-Action', type: 'AFTER_ACTION', lastUsed: new Date(Date.now() - 86400000 * 30) },
];

const ANALYTICS_TREND_DATA = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 28 },
  { day: 'Sat', count: 35 },
  { day: 'Sun', count: 20 },
];

const ANALYTICS_TYPE_DATA = [
  { name: 'Fire', value: 30 },
  { name: 'Medical', value: 45 },
  { name: 'Police', value: 60 },
  { name: 'Traffic', value: 25 },
];

const COLORS = ['#EF4444', '#3B82F6', '#6366F1', '#F59E0B'];

const SafetyReportsPage: React.FC<SafetyReportsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'templates' | 'history' | 'analytics'>('create');
  const [reportType, setReportType] = useState<ReportType | 'SELECT'>('SELECT');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return (
          <div className="space-y-6 animate-fade-in-up">
            {reportType === 'SELECT' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: 'INCIDENT', label: 'Incident Report', icon: AlertTriangle, desc: 'Standard incident documentation' },
                  { id: 'DAILY_ACTIVITY', label: 'Daily Activity', icon: ClipboardList, desc: 'Shift logs and routine checks' },
                  { id: 'AFTER_ACTION', label: 'After-Action', icon: FileCheck, desc: 'Post-incident analysis & review' },
                  { id: 'CUSTOM', label: 'Custom Report', icon: FileText, desc: 'Blank template for other needs' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setReportType(item.id as ReportType)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-blue-400">
                      <item.icon size={32} />
                    </div>
                    <h3 className="text-white font-bold mb-2">{item.label}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                 <div className="bg-slate-900/50 border-b border-slate-700 p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <FileText size={18} className="text-blue-400" />
                      New {reportType.replace('_', ' ')} Report
                    </h3>
                    <div className="text-xs text-gray-500 font-mono">ID: DRAFT-2024-X</div>
                 </div>
                 
                 <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Details */}
                    <div className="space-y-4">
                       <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">Incident Details</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Incident ID Reference</label>
                             <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none">
                                <option>Select Incident...</option>
                                <option>INC-2547 (Structure Fire)</option>
                                <option>INC-2548 (Medical)</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Date & Time</label>
                             <div className="relative">
                                <input type="datetime-local" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none" />
                             </div>
                          </div>
                       </div>
                       
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Reporting Officer</label>
                          <input type="text" defaultValue="Officer J. Doe (Badge #8842)" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none" />
                       </div>

                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                          <div className="flex gap-2">
                             <input type="text" placeholder="Address or Coordinates" className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none" />
                             <button className="bg-slate-700 px-3 rounded text-gray-300 hover:text-white"><MapPin size={16} /></button>
                          </div>
                       </div>

                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Executive Summary</label>
                          <textarea className="w-full h-32 bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none resize-none" placeholder="Briefly describe the incident..."></textarea>
                       </div>
                    </div>

                    {/* Right Column: Resources & Outcome */}
                    <div className="space-y-4">
                       <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">Personnel & Outcomes</h4>
                       
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Units Responded</label>
                          <input type="text" placeholder="e.g. FIRE-3, FIRE-5, PD-12" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none" />
                       </div>

                       <div className="grid grid-cols-3 gap-4">
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Fatalities</label>
                             <input type="number" defaultValue="0" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Injuries</label>
                             <input type="number" defaultValue="0" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1">Prop. Damage</label>
                             <select className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-blue-500 outline-none">
                                <option>None</option>
                                <option>Minor</option>
                                <option>Major</option>
                                <option>Total</option>
                             </select>
                          </div>
                       </div>

                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Evidence / Media</label>
                          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-slate-900/50 hover:border-blue-500 transition-colors cursor-pointer">
                             <UploadCloud size={24} className="mb-2" />
                             <span className="text-xs">Click to upload images or docs</span>
                          </div>
                       </div>

                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Follow-Up Actions</label>
                          <div className="space-y-2">
                             <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input type="checkbox" className="accent-blue-500" /> Investigation Ongoing
                             </label>
                             <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input type="checkbox" className="accent-blue-500" /> Refer to City Administration
                             </label>
                             <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input type="checkbox" className="accent-blue-500" /> Case Closed / No Further Action
                             </label>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Footer Actions */}
                 <div className="bg-slate-900 p-4 border-t border-slate-700 flex justify-between items-center">
                    <button onClick={() => setReportType('SELECT')} className="text-gray-400 hover:text-white text-sm font-medium px-4">Cancel</button>
                    <div className="flex gap-3">
                       <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-bold transition-colors">
                          <Save size={16} /> Save Draft
                       </button>
                       <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold shadow-lg shadow-blue-500/20 transition-colors">
                          <FileCheck size={16} /> Generate Final Report
                       </button>
                    </div>
                 </div>
              </div>
            )}
          </div>
        );

      case 'templates':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {MOCK_TEMPLATES.map(tpl => (
              <div key={tpl.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-900 rounded-lg text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-900/20 transition-colors">
                       <FileText size={24} />
                    </div>
                    <span className="text-xs bg-slate-900 px-2 py-1 rounded text-gray-400">{tpl.type}</span>
                 </div>
                 <h3 className="text-white font-bold text-lg mb-2">{tpl.name}</h3>
                 <p className="text-xs text-gray-500 mb-6">Last used: {tpl.lastUsed.toLocaleDateString()}</p>
                 <button 
                   onClick={() => {
                     setActiveTab('create');
                     setReportType(tpl.type);
                   }}
                   className="w-full py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white font-bold text-sm transition-colors"
                 >
                   Use Template
                 </button>
              </div>
            ))}
            <button className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-blue-400 hover:border-blue-500/50 transition-colors">
                <Plus size={32} className="mb-2" />
                <span className="font-bold">Create New Template</span>
            </button>
          </div>
        );

      case 'history':
        return (
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden animate-fade-in-up">
             {/* Toolbar */}
             <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-64">
                   <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                   <input 
                     type="text" 
                     placeholder="Search reports..." 
                     className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none"
                   />
                </div>
                <div className="flex gap-2">
                   <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-gray-300 rounded hover:text-white text-xs font-bold">
                      <Filter size={14} /> Filter
                   </button>
                   <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-gray-300 rounded hover:text-white text-xs font-bold">
                      <Calendar size={14} /> Date Range
                   </button>
                </div>
             </div>

             {/* Table */}
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-900/50 text-gray-400 text-xs uppercase border-b border-slate-700">
                         <th className="p-4 font-bold">Report ID</th>
                         <th className="p-4 font-bold">Title / Incident</th>
                         <th className="p-4 font-bold">Type</th>
                         <th className="p-4 font-bold">Author</th>
                         <th className="p-4 font-bold">Date</th>
                         <th className="p-4 font-bold">Status</th>
                         <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-700">
                      {MOCK_REPORTS.map(rpt => (
                         <tr key={rpt.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="p-4 text-sm font-mono text-blue-400">{rpt.id}</td>
                            <td className="p-4 text-sm text-white font-medium">
                               {rpt.title}
                               {rpt.incidentRef && <div className="text-xs text-gray-500 mt-0.5">Ref: {rpt.incidentRef}</div>}
                            </td>
                            <td className="p-4 text-xs text-gray-400">{rpt.type}</td>
                            <td className="p-4 text-xs text-gray-400">{rpt.author}</td>
                            <td className="p-4 text-xs text-gray-400">{rpt.dateCreated.toLocaleDateString()}</td>
                            <td className="p-4">
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  rpt.status === 'FINAL' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                               }`}>
                                  {rpt.status}
                               </span>
                            </td>
                            <td className="p-4 text-right">
                               <div className="flex justify-end gap-2">
                                  <button className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-600 rounded"><Eye size={16} /></button>
                                  <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-slate-600 rounded"><Download size={16} /></button>
                                  <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-slate-600 rounded"><Trash2 size={16} /></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6 animate-fade-in-up">
             {/* Stat Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Reports Generated', value: '147', change: '+12%', color: 'text-blue-400' },
                  { label: 'Avg. Completion Time', value: '14m', change: '-2m', color: 'text-green-400' },
                  { label: 'Pending Review', value: '8', change: '', color: 'text-yellow-400' },
                  { label: 'Total Incidents', value: '203', change: '+5%', color: 'text-purple-400' },
                ].map((stat, i) => (
                   <div key={i} className="bg-slate-800 border border-slate-700 p-4 rounded-xl">
                      <div className="text-gray-500 text-xs font-bold uppercase mb-1">{stat.label}</div>
                      <div className="flex items-end justify-between">
                         <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                         {stat.change && <div className="text-xs text-gray-400 bg-slate-700 px-1.5 py-0.5 rounded">{stat.change}</div>}
                      </div>
                   </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
                   <h3 className="text-white font-bold mb-6">Incident Reporting Trends (Last 7 Days)</h3>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={ANALYTICS_TREND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
                   <h3 className="text-white font-bold mb-6">Incident Type Breakdown</h3>
                   <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={ANALYTICS_TYPE_DATA}
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={5}
                               dataKey="value"
                            >
                               {ANALYTICS_TYPE_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                   <Download size={16} /> Export Analytics PDF
                </button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
               </button>
               <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                     <FileText className="text-blue-500" /> SAFETY REPORTS
                  </h1>
                  <p className="text-xs text-gray-500">Generate, manage, and analyze incident documentation.</p>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <div className="text-2xl font-bold text-white">147</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reports This Month</div>
               </div>
               <div className="h-8 w-[1px] bg-slate-700 hidden sm:block"></div>
               <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 hover:border-blue-500/50 px-4 py-2 rounded-lg font-bold text-sm transition-all">
                  <Download size={18} /> Download All
               </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
             {[
               { id: 'create', label: 'Create New Report' },
               { id: 'templates', label: 'Report Templates' },
               { id: 'history', label: 'Generated Reports' },
               { id: 'analytics', label: 'Basic Analytics' },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`
                   px-6 py-3 rounded-t-lg font-bold text-sm whitespace-nowrap transition-colors border-b-2
                   ${activeTab === tab.id 
                     ? 'bg-slate-800 text-white border-blue-500' 
                     : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-slate-800/50'
                   }
                 `}
               >
                 {tab.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-950 p-4 md:p-8 overflow-y-auto">
         <div className="max-w-7xl mx-auto">
            {renderTabContent()}
         </div>
      </div>
    </div>
  );
};

export default SafetyReportsPage;
