import React from 'react';
import { UserPlus, LayoutGrid, BellRing } from 'lucide-react';
import { Step } from '../types';

const steps: Step[] = [
  {
    id: 1,
    title: 'Register & Connect',
    description: 'Create your secure Citizen ID and connect your household utilities to the Nexus network.',
    icon: UserPlus,
  },
  {
    id: 2,
    title: 'Access Services',
    description: 'Use the dashboard to pay bills, report issues, or check real-time transit schedules.',
    icon: LayoutGrid,
  },
  {
    id: 3,
    title: 'Real-time Updates',
    description: 'Receive instant notifications about city alerts, service maintenance, and community events.',
    icon: BellRing,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-bgLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Urban Nexus Works</h2>
          <p className="text-gray-600">Connecting you to your city in three simple steps.</p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 -z-0"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mb-6 relative">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary">
                    <step.icon size={24} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
                  {step.id}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;