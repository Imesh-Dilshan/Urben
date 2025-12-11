
import React, { useState } from 'react';
import { 
  Home, AlertTriangle, DollarSign, Recycle, Zap, Bus, Shield, 
  Settings, Bell, Search, Menu, X, LogOut, ChevronRight, CheckCircle,
  MapPin, Calendar, CreditCard, ChevronDown, Activity, User
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CitizenBill, CitizenIssue, TransitRoute } from '../types';

interface CitizenDashboardProps {
  onLogout: () => void;
  userName?: string;
}

// --- Mock Data ---

const BILLS: CitizenBill[] = [
  { id: '1', service: 'Water & Sewage', amount: 45.20, dueDate: new Date(Date.now() + 86400000 * 5), status: 'DUE' },
  { id: '2', service: 'Electricity', amount: 112.50, dueDate: new Date(Date.now() + 86400000 * 12), status: 'DUE' },
  { id: '3', service: 'Waste Collection', amount: 25.00, dueDate: new Date(Date.now() - 86400000 * 2), status: 'OVERDUE' },
];

const ISSUES: CitizenIssue[] = [
  { id: 'ISS-102', title: 'Pothole on Main St', status: 'IN_PROGRESS', date: new Date(Date.now() - 86400000 * 2) },
  { id: 'ISS-098', title: 'Streetlight Outage', status: 'SUBMITTED', date: new Date(Date.now() - 86400000 * 5) },
  { id: 'ISS-055', title: 'Missed Trash Pickup', status: 'RESOLVED', date: new Date(Date.now() - 86400000 * 20) },
];

const TRANSIT: TransitRoute[] = [
  { id: 'R-42', name: 'Downtown Express', status: 'ON_TIME', nextArrival: '4 min' },
  { id: 'R-12', name: 'Northside Loop', status: 'DELAYED', nextArrival: '15 min' },
];

const ENERGY_DATA = [
  { name: 'Used', value: 320 },
  { name: 'Remaining', value: 180 },
];
const ENERGY_COLORS = ['#4A9FF5', '#E2E8F0'];

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onLogout, userName = "Citizen" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Dashboard Home', icon: Home },
    { id: 'report', label: 'Report Issue', icon: AlertTriangle },
    { id: 'bills', label: 'Bills & Payments', icon: DollarSign },
    { id: 'waste', label: 'Waste Management', icon: Recycle },
    { id: 'energy', label: 'Energy Usage', icon: Zap },
    { id: 'transit', label: 'Transportation', icon: Bus },
    { id: 'safety', label: 'Safety Alerts', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-yellow-100 text-yellow-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      case 'DUE': return 'bg-blue-100 text-blue-700';
      case 'OVERDUE': return 'bg-red-100 text-red-700';
      case 'PAID': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-bgLight flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          lg:relative
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <div className={`flex items-center gap-2 ${!isSidebarOpen && 'justify-center w-full'}`}>
             <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white shrink-0">
                <span className="font-bold">U</span>
             </div>
             {isSidebarOpen && <span className="font-bold text-lg text-slate-800">Urban Nexus</span>}
          </div>
          {isSidebarOpen && (
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
             </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${activeSection === item.id 
                  ? 'bg-blue-50 text-primary font-semibold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }
                ${!isSidebarOpen && 'justify-center'}
              `}
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon size={22} className={activeSection === item.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
              {isSidebarOpen && <span>{item.label}</span>}
              {isSidebarOpen && activeSection === item.id && <ChevronRight size={16} className="ml-auto text-primary" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <button 
             onClick={onLogout}
             className={`
               w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors
               ${!isSidebarOpen && 'justify-center'}
             `}
           >
             <LogOut size={22} />
             {isSidebarOpen && <span className="font-medium">Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-lg lg:hidden">
                 <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-800 hidden sm:block">My Dashboard</h2>
           </div>

           <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                 <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search services..." 
                   className="bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none w-64"
                 />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-full transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="h-8 w-px bg-gray-200 mx-1"></div>
              <button className="flex items-center gap-3 hover:bg-gray-50 rounded-full p-1 pl-2 transition-colors">
                 <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-gray-900">{userName}</div>
                    <div className="text-xs text-gray-500">Resident</div>
                 </div>
                 <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
                    <User size={20} className="text-gray-500" />
                 </div>
                 <ChevronDown size={14} className="text-gray-400" />
              </button>
           </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
           
           {/* Welcome Section */}
           <section className="mb-8">
              <div className="flex justify-between items-end mb-6">
                 <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hello, {userName.split(' ')[0]} 👋</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening in your city today.</p>
                 </div>
                 <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="text-xs text-gray-500">Tech City, Zone 4</div>
                 </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all group text-left">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       <AlertTriangle size={20} />
                    </div>
                    <div className="font-bold text-gray-900">Report Issue</div>
                    <div className="text-xs text-gray-500">Potholes, outages, etc.</div>
                 </button>
                 <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group text-left">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       <CreditCard size={20} />
                    </div>
                    <div className="font-bold text-gray-900">Pay Bills</div>
                    <div className="text-xs text-gray-500">Utilities & Services</div>
                 </button>
                 <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all group text-left">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       <Recycle size={20} />
                    </div>
                    <div className="font-bold text-gray-900">Pickup Schedule</div>
                    <div className="text-xs text-gray-500">Waste & Recycling</div>
                 </button>
                 <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all group text-left">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       <Bell size={20} />
                    </div>
                    <div className="font-bold text-gray-900">View Alerts</div>
                    <div className="text-xs text-gray-500">City Notifications</div>
                 </button>
              </div>
           </section>

           {/* Main Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              
              {/* Column 1: Alerts & Issues */}
              <div className="space-y-6">
                 {/* Active Alert Card */}
                 <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex justify-between items-center">
                       <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                          <Shield size={16} /> Active City Alerts
                       </div>
                       <span className="bg-red-200 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold">1 NEW</span>
                    </div>
                    <div className="p-4">
                       <div className="flex gap-3 mb-3">
                          <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                          <div>
                             <h4 className="text-sm font-bold text-gray-900">Road Maintenance</h4>
                             <p className="text-xs text-gray-500 mt-1">Main St. closed for repairs until 5 PM. Use alternate routes.</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* My Issues */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-gray-900">My Reports</h3>
                       <button className="text-primary text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                       {ISSUES.map(issue => (
                          <div key={issue.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                             <div>
                                <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                                <div className="text-xs text-gray-500">{issue.date.toLocaleDateString()}</div>
                             </div>
                             <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                                {issue.status.replace('_', ' ')}
                             </span>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Waste Collection */}
                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-start justify-between mb-4">
                       <div>
                          <h3 className="font-bold text-gray-900">Next Collection</h3>
                          <p className="text-xs text-gray-500">Recycling & Compost</p>
                       </div>
                       <Recycle className="text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">Tuesday</div>
                    <div className="text-sm text-gray-600 mb-4">Oct 24th • 7:00 AM</div>
                    <button className="w-full bg-white text-green-600 border border-green-200 font-bold py-2 rounded-lg text-sm hover:bg-green-50 transition-colors">
                       Schedule Special Pickup
                    </button>
                 </div>
              </div>

              {/* Column 2: Usage & Transit */}
              <div className="space-y-6">
                 {/* Energy Usage Chart */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="font-bold text-gray-900">Energy Usage</h3>
                       <Zap size={16} className="text-yellow-500" />
                    </div>
                    <p className="text-xs text-gray-500 mb-6">Oct 1 - Oct 23</p>
                    
                    <div className="h-48 relative flex items-center justify-center">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie
                                data={ENERGY_DATA}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                             >
                                {ENERGY_DATA.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={ENERGY_COLORS[index % ENERGY_COLORS.length]} />
                                ))}
                             </Pie>
                             <Tooltip />
                          </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900">320</span>
                          <span className="text-xs text-gray-500">kWh</span>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                       <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500">Daily Avg</div>
                          <div className="font-bold text-gray-900">14.2 kWh</div>
                       </div>
                       <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500">Proj. Bill</div>
                          <div className="font-bold text-gray-900">$48.50</div>
                       </div>
                    </div>
                 </div>

                 {/* Transport Card */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-gray-900">My Transit</h3>
                       <Bus size={16} className="text-blue-500" />
                    </div>
                    <div className="space-y-3">
                       {TRANSIT.map(route => (
                          <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                   {route.id.split('-')[1]}
                                </div>
                                <div>
                                   <div className="font-bold text-sm text-gray-900">{route.name}</div>
                                   <div className={`text-[10px] font-bold ${route.status === 'ON_TIME' ? 'text-green-600' : 'text-red-500'}`}>
                                      {route.status.replace('_', ' ')}
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="text-xs text-gray-500">Arrives in</div>
                                <div className="font-bold text-gray-900">{route.nextArrival}</div>
                             </div>
                          </div>
                       ))}
                    </div>
                    <button className="w-full mt-4 text-primary text-sm font-bold hover:underline">
                       View Full Schedule
                    </button>
                 </div>
              </div>

              {/* Column 3: Bills & Safety */}
              <div className="space-y-6">
                 {/* Bills Card */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-gray-900">Outstanding Bills</h3>
                       <div className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">
                          {BILLS.filter(b => b.status === 'OVERDUE').length} Overdue
                       </div>
                    </div>
                    <div className="mb-6">
                       <div className="text-xs text-gray-500 uppercase font-bold">Total Due</div>
                       <div className="text-3xl font-bold text-gray-900">
                          ${BILLS.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                       </div>
                    </div>
                    <div className="space-y-4 mb-6">
                       {BILLS.map(bill => (
                          <div key={bill.id} className="flex justify-between items-center">
                             <div>
                                <div className="text-sm font-medium text-gray-900">{bill.service}</div>
                                <div className={`text-xs ${bill.status === 'OVERDUE' ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                   Due {bill.dueDate.toLocaleDateString()}
                                </div>
                             </div>
                             <div className="font-bold text-gray-900">${bill.amount.toFixed(2)}</div>
                          </div>
                       ))}
                    </div>
                    <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                       Pay All Now
                    </button>
                 </div>

                 {/* Safety Score */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                     <h3 className="font-bold text-gray-900 mb-4">Neighborhood Safety</h3>
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                           <span className="text-xl font-bold text-green-600">92</span>
                        </div>
                        <div>
                           <div className="text-sm font-bold text-gray-900">Excellent</div>
                           <p className="text-xs text-gray-500">Low incident reports in Zone 4 this week.</p>
                        </div>
                     </div>
                 </div>

                 {/* Energy Tip */}
                 <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                    <div className="flex gap-2 items-start mb-2">
                       <div className="bg-yellow-200 p-1 rounded text-yellow-700"><Zap size={14} /></div>
                       <h3 className="font-bold text-yellow-800 text-sm">Tip of the Day</h3>
                    </div>
                    <p className="text-sm text-yellow-900 italic">
                       "Unplug electronics when not in use to save up to 10% on your monthly bill."
                    </p>
                 </div>
              </div>

           </div>
           
           {/* Bottom Status Bar */}
           <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-6 overflow-x-auto pb-2 sm:pb-0">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-xs font-bold text-gray-600 uppercase">Transport: Normal</div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-xs font-bold text-gray-600 uppercase">Energy: Stable</div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="text-xs font-bold text-gray-600 uppercase">Waste: Delays</div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-xs font-bold text-gray-600 uppercase">Safety: Low Risk</div>
                 </div>
              </div>
              <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium">
                 <Settings size={16} /> Settings
              </button>
           </div>

        </div>

      </main>
    </div>
  );
};

export default CitizenDashboard;
