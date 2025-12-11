import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Resident, Downtown District',
    quote: "The transit app has completely changed my commute. Knowing exactly when the bus arrives down to the second allows me to plan my mornings perfectly.",
    image: 'https://picsum.photos/id/64/200/200',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Small Business Owner',
    quote: "Reporting maintenance issues like potholes or streetlights used to take weeks. With Urban Nexus, I snap a photo, and it's fixed within 48 hours.",
    image: 'https://picsum.photos/id/91/200/200',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Urban Planner',
    quote: "The open data portal is a game-changer. We can now visualize neighborhood growth patterns and allocate resources where they are truly needed.",
    image: 'https://picsum.photos/id/129/200/200',
  },
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-bgLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Citizens Are Saying</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden min-h-[300px] flex flex-col justify-center items-center text-center transition-all duration-500">
            {/* Background Decorations */}
            <Quote className="absolute top-6 left-8 text-blue-100 w-24 h-24 -z-0 opacity-50" />
            
            <div className="relative z-10 animate-fade-in">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-blue-50">
                    <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <p className="text-xl md:text-2xl text-gray-700 italic font-medium mb-6 leading-relaxed">
                    "{testimonials[currentIndex].quote}"
                </p>

                <h4 className="text-lg font-bold text-gray-900">{testimonials[currentIndex].name}</h4>
                <p className="text-primary text-sm">{testimonials[currentIndex].role}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:-mx-12 pointer-events-none">
            <button 
                onClick={prevSlide}
                className="pointer-events-auto bg-white hover:bg-gray-50 text-gray-600 p-3 rounded-full shadow-lg border border-gray-100 transition-transform hover:scale-110 focus:outline-none"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={nextSlide}
                className="pointer-events-auto bg-white hover:bg-gray-50 text-gray-600 p-3 rounded-full shadow-lg border border-gray-100 transition-transform hover:scale-110 focus:outline-none"
            >
                <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;