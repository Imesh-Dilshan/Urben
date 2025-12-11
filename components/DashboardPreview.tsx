import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { Lock } from 'lucide-react';

const energyData = [
  { time: '00:00', usage: 40 },
  { time: '04:00', usage: 30 },
  { time: '08:00', usage: 85 },
  { time: '12:00', usage: 95 },
  { time: '16:00', usage: 70 },
  { time: '20:00', usage: 60 },
  { time: '23:59', usage: 50 },
];

const trafficData = [
  { zone: 'North', density: 65 },
  { zone: 'East', density: 40 },
  { zone: 'South', density: 85 },
  { zone: 'West', density: 55 },
];

interface DashboardPreviewProps {
  onLogin: () => void;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ onLogin }) => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Real-Time City Insights
            </h2>
            <p className="text-gray-600 max-w-xl">
              Administrators and citizens get access to granular data visualizations to make informed decisions.
            </p>
          </div>
          <button 
            onClick={onLogin}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View Live Demo
          </button>
        </div>

        {/* Dashboard Mockup Container */}
        <div className="relative bg-gray-900 rounded-2xl p-2 md:p-4 shadow-2xl border border-gray-800">
          {/* Top Bar Mockup */}
          <div className="flex items-center space-x-2 px-4 py-3 border-b border-gray-800 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="ml-4 bg-gray-800 rounded px-3 py-1 text-xs text-gray-400 font-mono flex-grow max-w-sm">
                urbannexus.city/dashboard/admin
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px] overflow-hidden">
             {/* Left Column: Sidebar & KPI */}
             <div className="hidden md:flex flex-col gap-4 col-span-1">
                <div className="bg-gray-800 rounded-xl p-4 flex-grow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded bg-primary/20"></div>
                        <div className="h-4 w-24 bg-gray-700 rounded"></div>
                    </div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 w-full mb-2 bg-gray-700/50 rounded flex items-center px-3">
                            <div className="h-2 w-2 rounded-full bg-gray-600 mr-3"></div>
                            <div className="h-3 w-20 bg-gray-600 rounded"></div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Main Content */}
             <div className="col-span-1 md:col-span-2 grid grid-rows-2 gap-4">
                {/* Chart 1 */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-gray-300 text-sm font-semibold mb-4">City Energy Consumption (MW)</h4>
                    <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={energyData}>
                                <defs>
                                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4A9FF5" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4A9FF5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                    itemStyle={{ color: '#4A9FF5' }}
                                />
                                <Area type="monotone" dataKey="usage" stroke="#4A9FF5" fillOpacity={1} fill="url(#colorUsage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50">
                         <h4 className="text-gray-300 text-sm font-semibold mb-4">Traffic Density</h4>
                         <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trafficData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis dataKey="zone" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}/>
                                    <Bar dataKey="density" fill="#FFC542" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                         </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 flex flex-col justify-between">
                        <h4 className="text-gray-300 text-sm font-semibold mb-2">Air Quality Index</h4>
                        <div className="flex items-end space-x-2">
                             <span className="text-5xl font-bold text-green-400">42</span>
                             <span className="text-sm text-gray-400 mb-2">/ 500 (Good)</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mt-4">
                            <div className="bg-green-400 h-full w-[15%]"></div>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* CTA Overlay */}
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl z-10">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 transform transition-transform hover:scale-105">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                    <Lock size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Restricted Access</h3>
                <p className="text-gray-500 text-sm mb-6">
                    This is a preview of the central command dashboard. Authorized personnel only.
                </p>
                <button 
                  onClick={onLogin}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    Login to View Full Dashboard
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
