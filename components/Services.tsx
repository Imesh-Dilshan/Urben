import React from 'react';
import { Car, Zap, Trash2, Shield, Users, BarChart3, ArrowRight } from 'lucide-react';
import { Service } from '../types';

const services: Service[] = [
  {
    id: 'transport',
    title: 'Smart Transportation',
    description: 'Real-time tracking of public transit, traffic flow optimization, and smart parking solutions.',
    icon: Car,
    color: '#4A9FF5',
  },
  {
    id: 'energy',
    title: 'Energy Management',
    description: 'Monitor grid consumption, optimize distribution, and manage renewable energy sources efficiently.',
    icon: Zap,
    color: '#FFC542',
  },
  {
    id: 'waste',
    title: 'Waste Management',
    description: 'IoT-enabled bin monitoring and optimized collection routes for a cleaner city.',
    icon: Trash2,
    color: '#10B981',
  },
  {
    id: 'safety',
    title: 'Public Safety',
    description: 'Integrated emergency response systems and predictive incident analysis.',
    icon: Shield,
    color: '#EF4444',
  },
  {
    id: 'citizen',
    title: 'Citizen Services',
    description: 'Digital portal for permits, voting, feedback, and community engagement.',
    icon: Users,
    color: '#9B87F5',
  },
  {
    id: 'analytics',
    title: 'Urban Analytics',
    description: 'Data-driven insights for city planning and resource allocation strategies.',
    icon: BarChart3,
    color: '#F97316',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Urban Management
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our interconnected modules work together to create a seamless, efficient, and sustainable urban environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300"
                style={{ backgroundColor: `${service.color}15` }}
              >
                <service.icon size={32} style={{ color: service.color }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <span>Learn More</span>
                <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;