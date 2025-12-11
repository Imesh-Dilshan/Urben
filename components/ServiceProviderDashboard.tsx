
import React, { useState } from 'react';
import {
  Home, ClipboardList, Map, Zap, BarChart3, FileText, Mail, 
  AlertTriangle, Truck, Settings, LogOut, Search, Bell, Menu, 
  ChevronRight, CheckCircle, Clock, MoreVertical, Plus, 
  ArrowUpRight, ArrowDownRight, User
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { ProviderTask, ServiceRequest, ProviderResource } from '../types';

interface ServiceProviderDashboardProps {
  onLogout: () => void;
}

// --- Mock Data ---

const KPI_METRICS = [
  { label: 'Assigned Tasks', value: '42', change: '+12%', trend: 'up', color: 'text-[#7C3AED]' },
  { label: 'Completed Today', value: '18', change: '+5%', trend: 'up', color: 'text-[#14B8A6]' },
  { label: 'Avg Response', value: '24m', change: '-2m', trend: 'up', color: 'text-[#06B6D4]' }, // trend up means good here
  { label: 'SLA Compliance', value: '98%', change: 'Stable', trend: 'neutral', color: 'text-[#7C3AED]' },
  { label: 'Active Requests', value: '7', change: '+2', trend: 'down', color: 'text-[#F97316]' },
];

const TASKS: ProviderTask[] = [
  { id: 'TSK-101', title: 'Power Grid Maintenance - Sector 4', requester: 'City Admin', location: 'Industrial District', time: '10:00 AM', category: 'Energy', priority: 'URGENT', status: 'IN_PROGRESS' },
  { id: 'TSK-102', title: 'Streetlight Repair', requester: 'Citizen Report', location: 'Main St & 5th', time: '11:30 AM', category: 'Infrastructure', priority: 'HIGH', status: 'PENDING' },
  { id: 'TSK-103', title: 'Waste Collection Route B', requester: 'Schedule', location: 'Residential Zone 2', time: '08:00 AM', category: 'Waste', priority: 'NORMAL', status: 'COMPLETED' },
  { id: 'TSK-104', title: 'Meter Inspection', requester: 'Auto-System', location: 'Tech Park', time: '02:00 PM', category: 'Energy', priority: 'NORMAL', status: 'PENDING' },
];

const REQUESTS: ServiceRequest[] = [
  { id: 'REQ-552', title: 'Urgent: Transformer Sparking', source: 'Public Safety', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 'REQ-551', title: 'Missed Pickup Complaint', source: 'Citizen Portal', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'REQ-550', title: 'New Connection Request', source: 'City Admin', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
];

const RESOURCES: ProviderResource[] = [
  { id: 'RES-1', name: 'Service Trucks', count: 8, total: 12, status: 'AVAILABLE' },
  { id: 'RES-2', name: 'Field Technicians', count: 5, total: 20, status: 'BUSY' },
  { id: 'RES-3', name: 'Spare Parts Kit', count: 2, total: 50, status: 'LOW_STOCK' },
];

const PERFORMANCE_DATA = [
  { name: 'Completed', value: 75 },
  { name: 'Pending', value: 25 },
];
const CHART_COLORS = ['#14B8A6', '#E2E8F0'];

const ServiceProviderDashboard: React.FC<ServiceProviderDashboardProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState<'ALL' | 'URGENT' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: Home },
    { id: 'tasks', label: 'Tasks & Requests', icon: ClipboardList },
    { id: 'route', label: 'Route / Grid Mgmt', icon: Map },
    { id: 'metrics', label: 'Performance Metrics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'incidents', label: 'Incidents Log', icon: AlertTriangle },
    { id: 'resources', label: 'Resources', icon: Truck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredTasks = TASKS.filter(task => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'URGENT') return task.priority === 'URGENT';
    if (activeTab === 'IN_PROGRESS') return task.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return task.status === 'COMPLETED';
    return true;
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'URGENT': return 'bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20';
      case 'HIGH': return 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20';
      default: return 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'COMPLETED': return 'bg-[#14B8A6]/20 text-[#14B8A6]';
      case 'IN_PROGRESS': return 'bg-[#F97316]/20 text-[#F97316]';
      default: return 'bg-[#EAB308]/20 text-[#EAB308]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex font-sans text-[#2D3748]">
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-[#E5E7EB] transition-all duration-300 flex flex-col shadow-lg
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          lg:relative
        `}
      >
        <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB]">
           <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
              <div className="w-10 h-10 bg-[#8B5CF6] rounded-lg flex items-center justify-center text-white shrink-0 shadow-md">
                 <Zap size={24} />
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="font-bold text-sm leading-tight text-[#2D3748]">Apex Energy Solutions</h1>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider">Service Provider</span>
                </div>
              )}
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
           {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                  ${activeSection === item.id 
                    ? 'bg-[#8B5CF6]/10 text-[#7C3AED] font-semibold' 
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#2D3748]'
                  }
                  ${!isSidebarOpen && 'justify-center'}
                `}
                title={!isSidebarOpen ? item.label : ''}
              >
                <item.icon size={20} className={activeSection === item.id ? 'text-[#7C3AED]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]'} />
                {isSidebarOpen && <span>{item.label}</span>}
                {isSidebarOpen && activeSection === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
           ))}
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
           <button 
             onClick={onLogout}
             className={`
               w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors
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
                <h2 className="text-xl font-bold text-[#2D3748] hidden sm:block">Operations Dashboard</h2>
                <div className="relative hidden md:block ml-4">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search tasks or requests..." 
                      className="bg-[#F3F4F6] border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#8B5CF6]/20 focus:outline-none w-64"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-[#7C3AED] hover:bg-[#F3F4F6] rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <div className="h-8 w-px bg-gray-200 mx-1"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-[#2D3748]">Mike Ross</div>
                        <div className="text-xs text-[#8B5CF6] font-bold">Field Supervisor</div>
                    </div>
                    <div className="w-10 h-10 bg-[#E2E8F0] rounded-full flex items-center justify-center text-gray-500 border border-white shadow-sm overflow-hidden">
                        <User size={24} />
                    </div>
                </div>
            </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
            
            {/* Welcome & Status Bar */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-[#2D3748]">Welcome back, Mike 👋</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-[#6B7280]">
                        <span>Company Rating:</span>
                        <span className="font-bold text-[#F59E0B]">⭐ 4.8/5.0</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                         <div className="text-[10px] font-bold text-[#9CA3AF] uppercase">Current Shift</div>
                         <div className="flex items-center gap-2 text-sm font-bold text-[#10B981]">
                             <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> Active
                         </div>
                    </div>
                    <div className="text-right border-l border-gray-100 pl-6">
                         <div className="text-2xl font-mono font-bold text-[#2D3748]">
                             {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                         <div className="text-[10px] font-bold text-[#9CA3AF] uppercase">
                             {new Date().toLocaleDateString()}
                         </div>
                    </div>
                </div>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {KPI_METRICS.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] hover:-translate-y-1 transition-transform duration-200">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-bold text-[#9CA3AF] uppercase">{kpi.label}</div>
                            {kpi.trend === 'up' ? <ArrowUpRight size={14} className="text-[#10B981]" /> : kpi.trend === 'down' ? <ArrowDownRight size={14} className="text-[#EF4444]" /> : null}
                        </div>
                        <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                        <div className="text-xs text-[#6B7280] mt-1 font-medium">{kpi.change} vs last week</div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Column 1: Tasks & Ops (60% -> 3/5 cols) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Task Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F8F9FC]">
                            <h3 className="font-bold text-[#2D3748] flex items-center gap-2">
                                <ClipboardList size={18} className="text-[#8B5CF6]" /> Task Management
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-1.5 hover:bg-gray-200 rounded text-[#6B7280]"><Search size={16} /></button>
                                <button className="p-1.5 hover:bg-gray-200 rounded text-[#6B7280]"><Settings size={16} /></button>
                            </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex border-b border-[#E5E7EB]">
                            {(['ALL', 'URGENT', 'IN_PROGRESS', 'COMPLETED'] as const).map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 text-xs font-bold transition-colors border-b-2 ${
                                        activeTab === tab 
                                        ? 'border-[#7C3AED] text-[#7C3AED] bg-[#F3F4F6]' 
                                        : 'border-transparent text-[#6B7280] hover:text-[#2D3748]'
                                    }`}
                                >
                                    {tab.replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        {/* Task List */}
                        <div className="p-4 space-y-3">
                            {filteredTasks.map(task => (
                                <div key={task.id} className="border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow bg-white group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-[#9CA3AF] font-bold">{task.id}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <div className="text-xs text-[#6B7280] flex items-center gap-1">
                                            <Clock size={12} /> {task.time}
                                        </div>
                                    </div>
                                    
                                    <h4 className="text-sm font-bold text-[#2D3748] mb-1">{task.title}</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-xs text-[#6B7280] mb-3">
                                        <div className="flex items-center gap-1"><User size={12} /> {task.requester}</div>
                                        <div className="flex items-center gap-1"><Map size={12} /> {task.location}</div>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusBadge(task.status)}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                        <button className="text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-3 py-1.5 rounded font-bold transition-colors shadow-sm shadow-purple-200">
                                            Update Status
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredTasks.length === 0 && (
                                <div className="text-center py-8 text-[#9CA3AF] text-sm italic">
                                    No tasks found in this category.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Operational Tools (Mock for Energy Provider) */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-[#2D3748] flex items-center gap-2">
                                <Zap size={18} className="text-[#F59E0B]" /> Grid Distribution View
                            </h3>
                            <button className="text-xs text-[#7C3AED] font-bold hover:underline">View Full Map</button>
                        </div>
                        <div className="h-48 bg-[#1E293B] rounded-lg relative overflow-hidden border border-[#E2E8F0]">
                             <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14441.07618163946!2d55.26772671470059!3d25.194147809918988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682f700cf983%3A0xb5cc58b076c0b904!2sBurj%20Khalifa%20-%20Downtown%20Dubai%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2slk!4v1765379128963!5m2!1sen!2slk" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                             <div className="absolute top-4 right-4 bg-red-500/90 text-white border border-red-500 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 animate-pulse z-10">
                                 <AlertTriangle size={12} /> 2 Outages Detected
                             </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="flex-1 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#2D3748] font-bold py-2 rounded-lg text-xs transition-colors border border-[#E5E7EB]">
                                Report Outage
                            </button>
                            <button className="flex-1 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#2D3748] font-bold py-2 rounded-lg text-xs transition-colors border border-[#E5E7EB]">
                                Re-route Power
                            </button>
                        </div>
                    </div>
                </div>

                {/* Column 2: Metrics & Reports (40% -> 2/5 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                        <h3 className="font-bold text-[#2D3748] mb-4">Task Completion Rate</h3>
                        <div className="h-40 relative flex items-center justify-center">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={PERFORMANCE_DATA}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                 >
                                    {PERFORMANCE_DATA.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                 </Pie>
                                 <Tooltip />
                              </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-2xl font-bold text-[#2D3748]">75%</span>
                              <span className="text-[10px] text-[#9CA3AF]">DONE</span>
                           </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="p-2 bg-teal-50 rounded text-teal-700 font-bold">18 Completed</div>
                            <div className="p-2 bg-gray-50 rounded text-gray-600 font-bold">6 Pending</div>
                        </div>
                    </div>

                    {/* Incoming Request Queue */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F8F9FC] flex justify-between items-center">
                            <h3 className="font-bold text-[#2D3748] text-sm">Incoming Requests</h3>
                            <span className="bg-[#F97316] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">3 NEW</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {REQUESTS.map(req => (
                                <div key={req.id} className="p-3 hover:bg-[#F9FAFB] transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-[#8B5CF6]">{req.source}</span>
                                        <span className="text-[10px] text-[#9CA3AF]">{Math.floor((Date.now() - req.timestamp.getTime())/60000)}m ago</span>
                                    </div>
                                    <div className="text-sm font-bold text-[#2D3748] mb-2">{req.title}</div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-[#14B8A6] text-white text-[10px] font-bold py-1.5 rounded hover:bg-[#0D9488]">Accept</button>
                                        <button className="flex-1 bg-[#F3F4F6] text-[#6B7280] text-[10px] font-bold py-1.5 rounded hover:bg-[#E5E7EB]">Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Reports */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4">
                        <h3 className="font-bold text-[#2D3748] mb-3 text-sm">Generate Reports</h3>
                        <div className="space-y-2">
                            <button className="w-full flex justify-between items-center p-2 rounded hover:bg-[#F3F4F6] border border-transparent hover:border-[#E5E7EB] transition-all group">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] group-hover:text-[#2D3748]">
                                    <FileText size={14} className="text-[#8B5CF6]" /> Daily Summary
                                </div>
                                <ArrowUpRight size={12} className="text-[#9CA3AF]" />
                            </button>
                            <button className="w-full flex justify-between items-center p-2 rounded hover:bg-[#F3F4F6] border border-transparent hover:border-[#E5E7EB] transition-all group">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] group-hover:text-[#2D3748]">
                                    <BarChart3 size={14} className="text-[#8B5CF6]" /> SLA Report
                                </div>
                                <ArrowUpRight size={12} className="text-[#9CA3AF]" />
                            </button>
                            <button className="w-full flex justify-between items-center p-2 rounded hover:bg-[#F3F4F6] border border-transparent hover:border-[#E5E7EB] transition-all group">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] group-hover:text-[#2D3748]">
                                    <AlertTriangle size={14} className="text-[#8B5CF6]" /> Incident Log
                                </div>
                                <ArrowUpRight size={12} className="text-[#9CA3AF]" />
                            </button>
                        </div>
                        <button className="w-full mt-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold py-2 rounded transition-colors shadow-sm">
                            Generate Selected
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Resources */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[#2D3748] flex items-center gap-2">
                        <Truck size={18} className="text-[#06B6D4]" /> Resource Status
                    </h3>
                    <button className="text-xs text-[#7C3AED] font-bold">Manage Inventory</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {RESOURCES.map(res => (
                        <div key={res.id} className="bg-[#F8F9FC] border border-[#E5E7EB] p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-[#2D3748]">{res.name}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    res.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                    res.status === 'BUSY' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {res.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-bold text-[#4B5563]">{res.count} <span className="text-sm font-normal text-[#9CA3AF]">/ {res.total}</span></div>
                                <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${res.status === 'LOW_STOCK' ? 'bg-red-500' : 'bg-blue-500'}`} 
                                        style={{width: `${(res.count / res.total) * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderDashboard;
