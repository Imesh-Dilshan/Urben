
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Bus, Zap, Recycle, Shield, AlertTriangle, 
  BarChart3, Briefcase, Search, Bell, Settings, LogOut, Menu, X,
  ChevronRight, ArrowUpRight, ArrowDownRight, User, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { AdminComplaint, SystemLog, BudgetMetric } from '../types';

interface CityAdminDashboardProps {
  onLogout: () => void;
}

// --- Mock Data ---

const KPI_METRICS = [
  { label: 'Citizens Registered', value: '842,050', change: '+2.4%', trend: 'up', color: 'text-blue-600' },
  { label: 'Active Service Requests', value: '1,245', change: '-5.1%', trend: 'down', color: 'text-orange-500' },
  { label: 'Energy Efficiency', value: '94.2%', change: '+0.8%', trend: 'up', color: 'text-green-600' },
  { label: 'Safety Incidents (24h)', value: '12', change: '-2', trend: 'down', color: 'text-red-600' },
  { label: 'Budget Utilization', value: '68%', change: 'On Track', trend: 'neutral', color: 'text-purple-600' },
];

const COMPLAINTS: AdminComplaint[] = [
  { id: 'CMP-2024-001', title: 'Delayed Waste Collection in District 4', category: 'Waste', status: 'UNASSIGNED', priority: 'HIGH', date: new Date() },
  { id: 'CMP-2024-002', title: 'Traffic Signal Malfunction Main St', category: 'Transport', status: 'IN_PROGRESS', priority: 'HIGH', date: new Date(Date.now() - 3600000 * 2) },
  { id: 'CMP-2024-003', title: 'Noise Complaint: Construction Zone', category: 'Public Safety', status: 'RESOLVED', priority: 'LOW', date: new Date(Date.now() - 3600000 * 5) },
];

const SYSTEM_LOGS: SystemLog[] = [
  { id: 'LOG-001', action: 'Emergency Fund Allocation Approved', user: 'Admin J. Smith', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 'LOG-002', action: 'System Maintenance Scheduled', user: 'IT Director', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 'LOG-003', action: 'New Transit Route Added (R-45)', user: 'Transport Dept', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
];

const ENERGY_CHART_DATA = [
  { time: '00:00', consumption: 420 },
  { time: '04:00', consumption: 380 },
  { time: '08:00', consumption: 850 },
  { time: '12:00', consumption: 980 },
  { time: '16:00', consumption: 920 },
  { time: '20:00', consumption: 750 },
  { time: '23:59', consumption: 550 },
];

const BUDGET_DATA: BudgetMetric[] = [
  { department: 'Public Safety', allocated: 40, spent: 28 },
  { department: 'Infrastructure', allocated: 30, spent: 15 },
  { department: 'Services', allocated: 20, spent: 18 },
  { department: 'Admin', allocated: 10, spent: 7 },
];
const BUDGET_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

const CityAdminDashboard: React.FC<CityAdminDashboardProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'citizen', label: 'Citizen Services', icon: Users },
    { id: 'transport', label: 'Transportation', icon: Bus },
    { id: 'energy', label: 'Energy Mgmt', icon: Zap },
    { id: 'waste', label: 'Waste Mgmt', icon: Recycle },
    { id: 'safety', label: 'Public Safety', icon: Shield },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'resources', label: 'Resources', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex font-sans text-[#2D3748]">
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#1E3A8A] text-white transition-all duration-300 flex flex-col shadow-xl
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          lg:relative
        `}
      >
        <div className="h-20 flex items-center px-4 border-b border-blue-800">
           <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg">
                 <Shield size={24} />
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="font-bold text-lg leading-tight">City Admin</h1>
                  <span className="text-[10px] text-blue-200 uppercase tracking-widest">Portal v3.0</span>
                </div>
              )}
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
           {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                  ${activeSection === item.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }
                  ${!isSidebarOpen && 'justify-center'}
                `}
                title={!isSidebarOpen ? item.label : ''}
              >
                <item.icon size={22} className={activeSection === item.id ? 'text-white' : 'text-blue-300 group-hover:text-white'} />
                {isSidebarOpen && <span>{item.label}</span>}
                {isSidebarOpen && activeSection === item.id && <ChevronRight size={16} className="ml-auto" />}
                
                {/* Notification Dot Mockup for Complaints */}
                {item.id === 'complaints' && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
           ))}
        </nav>

        <div className="p-4 border-t border-blue-800 bg-[#1E40AF]">
           <button 
             onClick={onLogout}
             className={`
               w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-200 hover:bg-red-900/30 hover:text-red-100 transition-colors
               ${!isSidebarOpen && 'justify-center'}
             `}
           >
             <LogOut size={20} />
             {isSidebarOpen && <span className="font-medium">Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-[#F8F9FC]">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 lg:px-8 shadow-sm z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-lg lg:hidden">
                    <Menu size={24} />
                </button>
                <div className="relative hidden md:block">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search services, citizens, reports..." 
                      className="bg-[#F3F4F6] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#3B82F6]/20 focus:outline-none w-80 text-[#2D3748]"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-full transition-colors">
                    <AlertTriangle size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button className="relative p-2 text-gray-400 hover:text-[#3B82F6] hover:bg-blue-50 rounded-full transition-colors">
                    <Bell size={20} />
                </button>
                <div className="h-8 w-px bg-gray-200 mx-1"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-[#2D3748]">Administrator</div>
                        <div className="text-xs text-gray-500 bg-[#E5E7EB] px-2 py-0.5 rounded-full inline-block mt-0.5">City Manager</div>
                    </div>
                    <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>

        {/* Dashboard Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
            
            {/* Title Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1E40AF]">City Command Center</h2>
                    <p className="text-[#6B7280] mt-1">Real-time overview of city operations and resources.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-[#E5E7EB] text-center">
                        <div className="text-xl font-mono font-bold text-[#2D3748]">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                            {currentTime.toLocaleDateString()}
                        </div>
                    </div>
                    <div className="bg-[#10B981]/10 text-[#059669] px-4 py-2 rounded-lg border border-[#10B981]/20 flex items-center gap-2 font-bold text-sm">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                        All Systems Operational
                    </div>
                </div>
            </div>

            {/* KPI Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {KPI_METRICS.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold text-[#9CA3AF] uppercase mb-1">{kpi.label}</div>
                        <div className="flex justify-between items-end">
                            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                            {kpi.change && (
                                <div className={`flex items-center text-xs font-bold ${
                                    kpi.trend === 'up' ? 'text-green-600' : 
                                    kpi.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                                }`}>
                                    {kpi.trend === 'up' ? <ArrowUpRight size={14} /> : kpi.trend === 'down' ? <ArrowDownRight size={14} /> : null}
                                    {kpi.change}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1: Alerts & Complaints */}
                <div className="space-y-8">
                    {/* Alerts Feed */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F8F9FC]">
                            <h3 className="font-bold text-[#1E40AF] flex items-center gap-2">
                                <AlertTriangle size={18} className="text-red-600" /> Critical Alerts
                            </h3>
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">3 Active</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">CRITICAL</span>
                                        <span className="text-[10px] text-gray-400">10m ago</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#2D3748] mb-1">Power Outage: Sector 7</p>
                                    <p className="text-xs text-[#6B7280] mb-3">Major grid failure reported. Crews dispatched.</p>
                                    <div className="flex gap-2">
                                        <button className="text-[10px] font-bold bg-[#3B82F6] text-white px-2 py-1 rounded hover:bg-blue-700">Assign</button>
                                        <button className="text-[10px] font-bold border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-100">Dismiss</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Complaints Queue */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
                            <h3 className="font-bold text-[#2D3748]">Complaints Queue</h3>
                            <button className="text-xs text-[#3B82F6] font-bold hover:underline">View All</button>
                        </div>
                        <div className="p-4 space-y-3">
                            {COMPLAINTS.map(cmp => (
                                <div key={cmp.id} className="p-3 bg-[#F8F9FC] rounded-lg border border-[#E5E7EB]">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                            cmp.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {cmp.priority}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{cmp.category}</span>
                                    </div>
                                    <div className="text-sm font-bold text-[#2D3748] line-clamp-1">{cmp.title}</div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-xs text-[#9CA3AF]">{cmp.id}</span>
                                        <button className="text-xs font-bold text-[#3B82F6] hover:text-blue-800">Assign Dept</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: Services & Energy Charts */}
                <div className="space-y-8">
                    {/* Energy Monitoring */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-[#2D3748] flex items-center gap-2">
                                <Zap size={18} className="text-[#F59E0B]" /> City Energy Load
                            </h3>
                            <div className="flex gap-2 text-xs">
                                <span className="flex items-center gap-1 text-[#6B7280]"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div> Consumed</span>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ENERGY_CHART_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '8px' }} />
                                    <Line type="monotone" dataKey="consumption" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#3B82F6'}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                             <div className="bg-[#F3F4F6] p-2 rounded">
                                 <div className="text-xs text-[#6B7280]">Renewable</div>
                                 <div className="font-bold text-[#10B981]">42%</div>
                             </div>
                             <div className="bg-[#F3F4F6] p-2 rounded">
                                 <div className="text-xs text-[#6B7280]">Grid Load</div>
                                 <div className="font-bold text-[#3B82F6]">88%</div>
                             </div>
                             <div className="bg-[#F3F4F6] p-2 rounded">
                                 <div className="text-xs text-[#6B7280]">Outages</div>
                                 <div className="font-bold text-[#DC2626]">2</div>
                             </div>
                        </div>
                    </div>

                    {/* Service Status Matrix */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                        <h3 className="font-bold text-[#2D3748] mb-4">Service Status Overview</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: 'Transport', status: 'Operational', color: 'green', icon: Bus },
                                { name: 'Waste Mgmt', status: 'Delays in Zone 2', color: 'yellow', icon: Recycle },
                                { name: 'Water', status: 'Operational', color: 'green', icon: Zap },
                                { name: 'Safety', status: 'High Alert', color: 'red', icon: Shield },
                            ].map((svc, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8F9FC]">
                                    <div className={`p-2 rounded-lg ${
                                        svc.color === 'green' ? 'bg-[#ECFDF5] text-[#059669]' :
                                        svc.color === 'yellow' ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-[#FEF2F2] text-[#DC2626]'
                                    }`}>
                                        <svc.icon size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#2D3748]">{svc.name}</div>
                                        <div className={`text-[10px] font-bold uppercase ${
                                            svc.color === 'green' ? 'text-[#059669]' :
                                            svc.color === 'yellow' ? 'text-[#D97706]' : 'text-[#DC2626]'
                                        }`}>
                                            {svc.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 3: Resources & Budget */}
                <div className="space-y-8">
                    {/* Budget Overview */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                        <h3 className="font-bold text-[#2D3748] mb-2 flex items-center gap-2">
                             <Briefcase size={18} className="text-[#3B82F6]" /> Budget Overview
                        </h3>
                        <div className="h-48 relative flex items-center justify-center">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={BUDGET_DATA}
                                    dataKey="allocated"
                                    nameKey="department"
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                 >
                                    {BUDGET_DATA.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={BUDGET_COLORS[index % BUDGET_COLORS.length]} />
                                    ))}
                                 </Pie>
                                 <Tooltip />
                                 <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                              </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-xl font-bold text-[#1F2937]">68%</span>
                              <span className="text-[10px] text-[#9CA3AF]">UTILIZED</span>
                           </div>
                        </div>
                        <div className="text-center mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                             <div className="text-xs font-bold text-red-800">Emergency Fund Status</div>
                             <div className="text-sm text-red-600 font-mono">$1.2M Remaining</div>
                        </div>
                    </div>

                    {/* System Activity Log */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
                        <div className="px-6 py-4 border-b border-[#E5E7EB]">
                            <h3 className="font-bold text-[#2D3748]">Activity Log</h3>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                            {SYSTEM_LOGS.map(log => (
                                <div key={log.id} className="p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                                        <span className="text-xs font-bold text-[#6B7280]">{log.user}</span>
                                        <span className="text-[10px] text-[#9CA3AF] ml-auto">{log.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-sm text-[#2D3748] pl-4">{log.action}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Section: Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <h3 className="font-bold text-[#2D3748] mb-4 uppercase text-xs tracking-wider">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F3F4F6] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-colors group">
                         <BarChart3 size={20} className="text-[#3B82F6] group-hover:text-white" />
                         <span className="text-xs font-bold">Generate Report</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F3F4F6] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-colors group">
                         <Briefcase size={20} className="text-[#3B82F6] group-hover:text-white" />
                         <span className="text-xs font-bold">Allocate Resources</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#FEF2F2] rounded-lg hover:bg-[#DC2626] hover:text-white transition-colors group">
                         <AlertTriangle size={20} className="text-[#DC2626] group-hover:text-white" />
                         <span className="text-xs font-bold text-red-700 group-hover:text-white">Broadcast Alert</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F3F4F6] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-colors group">
                         <Settings size={20} className="text-[#3B82F6] group-hover:text-white" />
                         <span className="text-xs font-bold">Manage Services</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F3F4F6] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-colors group">
                         <Calendar size={20} className="text-[#3B82F6] group-hover:text-white" />
                         <span className="text-xs font-bold">City Events</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F3F4F6] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-colors group">
                         <Users size={20} className="text-[#3B82F6] group-hover:text-white" />
                         <span className="text-xs font-bold">Manage Users</span>
                     </button>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default CityAdminDashboard;
