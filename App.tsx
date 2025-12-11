import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import DashboardPreview from './components/DashboardPreview';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import PublicSafetyDashboard from './components/PublicSafetyDashboard';
import CitizenAuth from './components/CitizenAuth';
import CitizenDashboard from './components/CitizenDashboard';
import AuthorityAuth from './components/AuthorityAuth';
import CityAdminDashboard from './components/CityAdminDashboard';
import ServiceProviderDashboard from './components/ServiceProviderDashboard';
import SystemAdminDashboard from './components/SystemAdminDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'authority-auth' | 'dashboard' | 'citizen-auth' | 'citizen-dashboard' | 'city-admin-dashboard' | 'service-provider-dashboard' | 'system-admin-dashboard'>('landing');
  const [citizenName, setCitizenName] = useState<string>('');

  const handleLoginClick = () => {
    // Navigate to Authority Login Page
    window.scrollTo(0, 0);
    setCurrentView('authority-auth');
  };

  const handleAuthorityLoginSuccess = () => {
    // Navigate to Public Safety Dashboard after successful authority login (Public Safety Role)
    window.scrollTo(0, 0);
    setCurrentView('dashboard');
  };

  const handleCityAdminLoginSuccess = () => {
    // Navigate to City Admin Dashboard after successful authority login (City Admin Role)
    window.scrollTo(0, 0);
    setCurrentView('city-admin-dashboard');
  };

  const handleServiceProviderLoginSuccess = () => {
      // Navigate to Service Provider Dashboard
      window.scrollTo(0, 0);
      setCurrentView('service-provider-dashboard');
  };

  const handleSystemAdminLoginSuccess = () => {
      // Navigate to System Admin Dashboard
      window.scrollTo(0, 0);
      setCurrentView('system-admin-dashboard');
  };
  
  const handleCitizenAuth = () => {
    window.scrollTo(0, 0);
    setCurrentView('citizen-auth');
  };

  const handleLogout = () => {
    window.scrollTo(0, 0);
    setCurrentView('landing');
    setCitizenName('');
  };

  if (currentView === 'dashboard') {
    return <PublicSafetyDashboard onLogout={handleLogout} />;
  }
  
  if (currentView === 'citizen-dashboard') {
      return <CitizenDashboard onLogout={handleLogout} userName={citizenName} />;
  }
  
  if (currentView === 'city-admin-dashboard') {
    return <CityAdminDashboard onLogout={handleLogout} />;
  }

  if (currentView === 'service-provider-dashboard') {
      return <ServiceProviderDashboard onLogout={handleLogout} />;
  }

  if (currentView === 'system-admin-dashboard') {
      return <SystemAdminDashboard onLogout={handleLogout} />;
  }

  if (currentView === 'citizen-auth') {
    return (
      <CitizenAuth 
        onBack={() => {
          window.scrollTo(0, 0);
          setCurrentView('landing');
        }}
        onLoginSuccess={(name) => {
          window.scrollTo(0, 0);
          setCitizenName(name);
          setCurrentView('citizen-dashboard');
        }}
      />
    );
  }

  if (currentView === 'authority-auth') {
    return (
      <AuthorityAuth 
        onBack={() => {
          window.scrollTo(0, 0);
          setCurrentView('landing');
        }}
        onLoginSuccess={handleAuthorityLoginSuccess}
        onCityAdminLoginSuccess={handleCityAdminLoginSuccess}
        onServiceProviderLoginSuccess={handleServiceProviderLoginSuccess}
        onSystemAdminLoginSuccess={handleSystemAdminLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <Header onLogin={handleLoginClick} onCitizenAuth={handleCitizenAuth} />
      <main className="flex-grow">
        <Hero />
        <Services />
        <HowItWorks />
        <DashboardPreview onLogin={handleLoginClick} />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default App;