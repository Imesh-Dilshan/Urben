import React, { useState, useEffect } from 'react';
import {
  Home, Users, Gauge, Shield, Settings, BarChart3, Bell, 
  Search, LogOut, Menu, User, Server, Database, 
  AlertTriangle, CheckCircle, XCircle, ArrowUp, ArrowDown,
  Activity, Lock, RefreshCw, FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, AreaChart, Area
} from 'recharts';
import { SecurityAlert, UserAccessLog, SystemConfigModule } from '../types';

interface SystemAdminDashboardProps {
  onLogout: () => void;
}

// --- Mock Data ---

const KPI_METRICS = [
  { label: 'Active Users', value: '1,245', change: '+12%', trend: 'up', icon: Users, color: 'text-[#0EA5E9]' },
  { label: 'System Uptime', value: '99.98%', change: '+0.01%', trend: 'up', icon: Server, color: 'text-[#22C55E]' },
  { label: 'Security Alerts', value: '3', change: '-2', trend: 'down', icon: Shield, color: 'text-[#EF4444]' },
  { label: 'Avg Response', value: '45ms', change: '-5ms', trend: 'up', icon: Activity, color: 'text-[#0EA5E9]' },
  { label: 'CPU Load', value: '42%', change: '+2%', trend: 'neutral', icon: Gauge, color: 'text-[#8B5CF6]' },
];

const SECURITY_ALERTS: SecurityAlert[] = [
  { id: 'SEC-001', severity: 'CRITICAL', message: 'Unauthorized Access Attempt detected on Admin Portal', timestamp: new Date(Date.now() - 1000 * 60 * 5), status: 'OPEN' },
  { id: 'SEC-002', severity: 'HIGH', message: 'Multiple failed login attempts from IP 192.168.1.5', timestamp: new Date(Date.now() - 1000 * 60 * 45), status: 'INVESTIGATING' },
  { id: 'SEC-003', severity: 'MEDIUM', message: 'Firewall policy update pending approval', timestamp: new Date(Date.now() - 1000 * 60 * 120), status: 'OPEN' },
];

const ACCESS_LOGS: UserAccessLog[] = [
  { id: 'LOG-101', user: 'admin.smith', ip: '10.0.0.5', status: 'SUCCESS', timestamp: new Date(), location: 'HQ Office' },
  { id: 'LOG-102', user: 'service.mike', ip: '10.0.0.12', status: 'SUCCESS', timestamp: new Date(Date.now() - 1000 * 60 * 2), location: 'Remote VPN' },
  { id: 'LOG-103', user: 'unknown', ip: '45.33.22.11', status: 'FAILED', timestamp: new Date(Date.now() - 1000 * 60 * 15), location: 'External' },
];

const CONFIG_MODULES: SystemConfigModule[] = [
  { name: 'Transportation API', status: 'OPERATIONAL', lastUpdated: new Date(Date.now() - 86400000), version: 'v2.4.1' },
  { name: 'Energy Grid Node', status: 'ISSUES', lastUpdated: new Date(Date.now() - 3600000), version: 'v1.8.0' },
  { name: 'Waste Mgmt IoT', status: 'OPERATIONAL', lastUpdated: new Date(Date.now() - 172800000), version: 'v3.0.2' },
  { name: 'Public Safety Core', status: 'OPERATIONAL', lastUpdated: new Date(Date.now() - 43200000), version: 'v2.5.5' },
];

const PERFORMANCE_DATA = [
  { time: '00:00', cpu: 20, memory: 40 },
  { time: '04:00', cpu: 25, memory: 42 },
  { time: '08:00', cpu: 65, memory: 60 },
  { time: '12:00', cpu: 75, memory: 70 },
  { time: '16:00', cpu: 60, memory: 65 },
  { time: '20:00', cpu: 45, memory: 50 },
  { time: '23:59', cpu: 30, memory: 45 },
];

const SystemAdminDashboard: React.FC<SystemAdminDashboardProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'performance', label: 'System Performance', icon: Gauge },
    { id: 'security', label: 'Security & Logs', icon: Shield },
    { id: 'config', label: 'Configurations', icon: Settings },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-[#EF4444] text-white';
      case 'HIGH': return 'bg-[#FB923C] text-white';
      case 'MEDIUM': return 'bg-[#F59E0B] text-white';
      case 'LOW': return 'bg-[#0EA5E9] text-white';
      default: return 'bg-[#6B7280] text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex font-sans text-[#374151]">
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#1F2937] text-gray-300 transition-all duration-300 flex flex-col shadow-xl
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          lg:relative
        `}
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-700">
           <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
              <div className="w-10 h-10 bg-[#0EA5E9] rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg">
                 <Settings size={24} />
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="font-bold text-sm leading-tight text-white">SysAdmin Portal</h1>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">v4.0.1 Stable</span>
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
                    ? 'bg-[#374151] text-white shadow-md border-l-4 border-[#0EA5E9]' 
                    : 'hover:bg-[#374151] hover:text-white'
                  }
                  ${!isSidebarOpen && 'justify-center'}
                `}
                title={!isSidebarOpen ? item.label : ''}
              >
                <item.icon size={20} className={activeSection === item.id ? 'text-[#0EA5E9]' : 'text-gray-400 group-hover:text-white'} />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                
                {item.id === 'alerts' && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></span>
                )}
              </button>
           ))}
        </nav>

        <div className="p-4 border-t border-gray-700 bg-[#111827]">
           <button 
             onClick={onLogout}
             className={`
               w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors
               ${!isSidebarOpen && 'justify-center'}
             `}
           >
             <LogOut size={20} />
             {isSidebarOpen && <span className="font-medium">Logout</span>}
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
                <h2 className="text-xl font-bold text-[#374151] hidden sm:block">System Administrator Portal</h2>
                <div className="relative hidden md:block ml-4">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search logs, users, configs..." 
                      className="bg-[#F3F4F6] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#0EA5E9]/20 focus:outline-none w-72 text-[#374151]"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-[#0EA5E9] hover:bg-blue-50 rounded-full transition-colors">
                    <Shield size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full border border-white"></span>
                </button>
                <div className="h-8 w-px bg-gray-200 mx-1"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-[#374151]">Root Admin</div>
                        <div className="text-xs text-[#0EA5E9] font-bold">System Superuser</div>
                    </div>
                    <div className="w-10 h-10 bg-[#374151] rounded-full flex items-center justify-center text-white shadow-sm overflow-hidden">
                        <Lock size={20} />
                    </div>
                </div>
            </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
            
            {/* Welcome & Status Bar */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#374151]">Welcome, System Admin</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#22C55E]/10 text-[#16A34A] rounded-full border border-[#22C55E]/20 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle size={14} /> All Systems Secure
                        </div>
                        <span className="text-xs text-gray-400">Last scan: 2 mins ago</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                    <div>
                         <div className="text-2xl font-mono font-bold text-[#374151] leading-none">
                             {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                         </div>
                         <div className="text-[10px] font-bold text-[#9CA3AF] uppercase">
                             {currentTime.toLocaleDateString()}
                         </div>
                    </div>
                </div>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {KPI_METRICS.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-bold text-[#9CA3AF] uppercase">{kpi.label}</div>
                            <kpi.icon size={16} className={`${kpi.color} opacity-80`} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#374151]">{kpi.value}</span>
                            <span className={`text-xs font-bold flex items-center ${kpi.trend === 'up' ? 'text-[#22C55E]' : kpi.trend === 'down' ? 'text-[#EF4444]' : 'text-gray-500'}`}>
                                {kpi.trend === 'up' ? <ArrowUp size={10} /> : kpi.trend === 'down' ? <ArrowDown size={10} /> : null}
                                {kpi.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Security & Alerts */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 border-b border-[#E5E7EB] bg-[#F8F9FC] flex justify-between items-center">
                            <h3 className="font-bold text-[#374151] text-sm flex items-center gap-2">
                                <Shield size={16} className="text-[#EF4444]" /> Critical Security Alerts
                            </h3>
                            <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">{SECURITY_ALERTS.length} Active</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {SECURITY_ALERTS.map(alert => (
                                <div key={alert.id} className="p-4 hover:bg-[#FEF2F2] transition-colors group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{Math.floor((Date.now() - alert.timestamp.getTime())/60000)}m ago</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#374151] mt-1 mb-2">{alert.message}</p>
                                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="text-[10px] font-bold bg-[#374151] text-white px-2 py-1 rounded hover:bg-black">Investigate</button>
                                        <button className="text-[10px] font-bold border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-100">Dismiss</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center">
                            <h3 className="font-bold text-[#374151] text-sm">User Access Logs</h3>
                            <button className="text-xs text-[#0EA5E9] font-bold hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                            {ACCESS_LOGS.map(log => (
                                <div key={log.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}></div>
                                        <div>
                                            <div className="text-xs font-bold text-[#374151]">{log.user}</div>
                                            <div className="text-[10px] text-gray-500">{log.ip} • {log.location}</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-gray-400 text-right">
                                        {log.timestamp.toLocaleTimeString()}
                                        <div className={`font-bold uppercase ${log.status === 'SUCCESS' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{log.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: Performance & Configs */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-[#374151] text-sm flex items-center gap-2">
                                <Activity size={16} className="text-[#0EA5E9]" /> System Performance
                            </h3>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={PERFORMANCE_DATA}>
                                    <defs>
                                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: '8px', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="cpu" stackId="1" stroke="#8B5CF6" fill="url(#colorCpu)" />
                                    <Area type="monotone" dataKey="memory" stackId="1" stroke="#0EA5E9" fill="url(#colorMem)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div> CPU Usage</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2 h-2 rounded-full bg-[#0EA5E9]"></div> Memory Usage</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center">
                            <h3 className="font-bold text-[#374151] text-sm">Configuration Status</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-3">
                            {CONFIG_MODULES.map((mod, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-[#F8F9FC] rounded border border-[#E5E7EB]">
                                    <div>
                                        <div className="text-sm font-bold text-[#374151]">{mod.name}</div>
                                        <div className="text-[10px] text-gray-500">Ver: {mod.version} • Updated: {mod.lastUpdated.toLocaleDateString()}</div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        mod.status === 'OPERATIONAL' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                                        mod.status === 'ISSUES' ? 'bg-[#FFEDD5] text-[#C2410C]' : 'bg-[#FEE2E2] text-[#B91C1C]'
                                    }`}>
                                        {mod.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-[#F8F9FC] border-t border-[#E5E7EB]">
                            <button className="w-full bg-white border border-gray-300 text-[#374151] text-xs font-bold py-2 rounded hover:bg-gray-50 transition-colors">
                                Manage Configurations
                            </button>
                        </div>
                    </div>
                </div>

                {/* Column 3: Resources & Reports */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                        <h3 className="font-bold text-[#374151] text-sm mb-4">Resource Allocation</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-600 font-bold">Server Load (Cluster A)</span>
                                    <span className="text-[#0EA5E9] font-bold">78%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#0EA5E9] w-[78%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-600 font-bold">Database Health</span>
                                    <span className="text-[#22C55E] font-bold">Good</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#22C55E] w-[95%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-600 font-bold">Backup Status (Last 24h)</span>
                                    <span className="text-[#F59E0B] font-bold">Syncing...</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#F59E0B] w-[45%] animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                         <h3 className="font-bold text-[#374151] text-sm mb-4 flex items-center gap-2">
                             <FileText size={16} className="text-[#8B5CF6]" /> Reports Center
                         </h3>
                         <div className="space-y-2">
                             <button className="w-full flex justify-between items-center p-2 text-xs font-bold text-[#6B7280] bg-[#F8F9FC] rounded hover:bg-[#F3F4F6] border border-transparent hover:border-gray-200 transition-colors">
                                 System Audit Log <ArrowUp size={12} className="rotate-45" />
                             </button>
                             <button className="w-full flex justify-between items-center p-2 text-xs font-bold text-[#6B7280] bg-[#F8F9FC] rounded hover:bg-[#F3F4F6] border border-transparent hover:border-gray-200 transition-colors">
                                 Performance Summary <ArrowUp size={12} className="rotate-45" />
                             </button>
                             <button className="w-full flex justify-between items-center p-2 text-xs font-bold text-[#6B7280] bg-[#F8F9FC] rounded hover:bg-[#F3F4F6] border border-transparent hover:border-gray-200 transition-colors">
                                 Security Incident Report <ArrowUp size={12} className="rotate-45" />
                             </button>
                         </div>
                         <button className="w-full mt-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold py-2 rounded transition-colors shadow-sm">
                             Generate New Report
                         </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                        <div className="flex items-center gap-2 mb-2 text-[#6B7280] text-xs font-bold uppercase">
                             <RefreshCw size={12} className="animate-spin-slow" /> Recent Activity
                        </div>
                        <ul className="space-y-3">
                             <li className="text-xs text-[#374151] border-l-2 border-[#0EA5E9] pl-2">
                                 <span className="font-bold">Firewall Rules Updated</span>
                                 <div className="text-gray-400 text-[10px]">By admin.smith • 10m ago</div>
                             </li>
                             <li className="text-xs text-[#374151] border-l-2 border-[#EF4444] pl-2">
                                 <span className="font-bold">User Account Suspended</span>
                                 <div className="text-gray-400 text-[10px]">By system.bot • 45m ago</div>
                             </li>
                        </ul>
                    </div>
                </div>

            </div>

            {/* Bottom Section: Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <h3 className="font-bold text-[#374151] mb-4 uppercase text-xs tracking-wider">Quick Admin Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F8F9FC] rounded-lg hover:bg-[#374151] hover:text-white transition-colors group border border-[#E5E7EB]">
                         <Users size={20} className="text-[#6B7280] group-hover:text-white" />
                         <span className="text-xs font-bold">Manage Users</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F8F9FC] rounded-lg hover:bg-[#0EA5E9] hover:text-white transition-colors group border border-[#E5E7EB]">
                         <Settings size={20} className="text-[#6B7280] group-hover:text-white" />
                         <span className="text-xs font-bold">Update Configs</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F8F9FC] rounded-lg hover:bg-[#8B5CF6] hover:text-white transition-colors group border border-[#E5E7EB]">
                         <BarChart3 size={20} className="text-[#6B7280] group-hover:text-white" />
                         <span className="text-xs font-bold">Generate Reports</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F8F9FC] rounded-lg hover:bg-[#6B7280] hover:text-white transition-colors group border border-[#E5E7EB]">
                         <FileText size={20} className="text-[#6B7280] group-hover:text-white" />
                         <span className="text-xs font-bold">Review Logs</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#FEF2F2] rounded-lg hover:bg-[#EF4444] hover:text-white transition-colors group border border-[#EF4444]/20">
                         <Shield size={20} className="text-[#EF4444] group-hover:text-white" />
                         <span className="text-xs font-bold text-[#EF4444] group-hover:text-white">Broadcast Alert</span>
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#F8F9FC] rounded-lg hover:bg-[#374151] hover:text-white transition-colors group border border-[#E5E7EB]">
                         <Server size={20} className="text-[#6B7280] group-hover:text-white" />
                         <span className="text-xs font-bold">System Settings</span>
                     </button>
                </div>
            </div>

            {/* Upcoming Maintenance */}
            <div className="bg-[#1F2937] rounded-xl shadow-lg border border-gray-700 p-6 text-gray-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg"><Settings size={20} /></div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Scheduled Maintenance</h3>
                        <p className="text-xs text-gray-500">Upcoming system patches and updates</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-[#374151] p-3 rounded border border-gray-600 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-sm text-white">Database Optimization Patch</div>
                            <div className="text-xs text-gray-400">Oct 28, 02:00 AM UTC</div>
                        </div>
                        <span className="text-[10px] bg-[#0EA5E9]/20 text-[#0EA5E9] px-2 py-1 rounded font-bold uppercase">Scheduled</span>
                    </div>
                    <div className="flex-1 bg-[#374151] p-3 rounded border border-gray-600 flex justify-between items-center">
                         <div>
                            <div className="font-bold text-sm text-white">Security Firmware Update</div>
                            <div className="text-xs text-gray-400">Nov 01, 01:00 AM UTC</div>
                        </div>
                        <span className="text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded font-bold uppercase">Pending Approval</span>
                    </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default SystemAdminDashboard;