import React, { useState, useEffect } from 'react';
import { Bus, Zap, Shield, ClipboardList, ArrowRight, Activity } from 'lucide-react';
import { Metric } from '../types';

// Helper hook for counting animation
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const incrementTime = (duration / end) * 1000;
    
    // For very large numbers, adjust logic slightly to avoid too many renders
    // simplified here for demo numbers
    
    const timer = setInterval(() => {
      start += 1;
      setCount(prev => {
        if (prev >= end) {
            clearInterval(timer);
            return end;
        }
        return prev + Math.ceil(end / 100); 
      });
    }, 20);

    return () => clearInterval(timer);
  }, [end, duration]);

  // Clamp value to end
  return Math.min(count, end);
};

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const count = useCounter(value);
  return <span>{count.toLocaleString()}</span>;
};

const metrics: Metric[] = [
  { id: '1', label: 'Buses Active', value: 487, icon: Bus, color: 'text-blue-500' },
  { id: '2', label: 'Energy Efficiency', value: 82, suffix: '%', icon: Zap, color: 'text-yellow-500' },
  { id: '3', label: 'Active Incidents', value: 3, icon: Shield, color: 'text-green-500' },
  { id: '4', label: 'Requests Today', value: 24, icon: ClipboardList, color: 'text-purple-500' },
];

const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-12 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
      
      {/* Decorative Circles */}
      <div className="absolute top-20 left-[-50px] w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-[-50px] w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold tracking-wider mb-4 uppercase">
                    Smart City v2.0
                </span>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                    Future of Urban Living
                </span>
                </h1>
            </div>
            <p className="text-lg lg:text-xl text-gray-600 max-w-lg leading-relaxed">
              Real-time city services, intelligent resource management, and seamless citizen engagement—all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center space-x-2 bg-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all transform hover:-translate-y-1">
                <span>Explore Services</span>
                <ArrowRight size={20} />
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-semibold hover:border-primary hover:text-primary transition-all">
                <span>View City Status</span>
                <Activity size={20} />
              </button>
            </div>
          </div>

          {/* Visual/Image */}
          <div className="relative lg:h-[500px] flex items-center justify-center">
             {/* Abstract City Representation */}
             <div className="relative w-full h-full max-w-md mx-auto lg:max-w-full perspective-1000">
                <img 
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop" 
                    alt="Smart City Nature" 
                    className="w-full h-auto rounded-2xl shadow-2xl transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-all duration-700 ease-out object-cover z-10 relative border-4 border-white aspect-square lg:aspect-auto"
                />
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white p-3 rounded-xl shadow-xl z-20 animate-bounce delay-100">
                    <Zap className="text-yellow-400 w-8 h-8" />
                </div>
                <div className="absolute bottom-12 -left-6 bg-white p-3 rounded-xl shadow-xl z-20 animate-bounce delay-300">
                    <Bus className="text-blue-400 w-8 h-8" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="mt-16 lg:mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                {metrics.map((metric) => (
                    <div key={metric.id} className="flex items-center space-x-4 pt-4 lg:pt-0 pl-0 lg:pl-4 first:pl-0 first:pt-0">
                        <div className={`p-3 rounded-full bg-gray-50 ${metric.color}`}>
                            <metric.icon size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                <AnimatedNumber value={metric.value} />
                                {metric.suffix}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                                {metric.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;