import React, { useState } from 'react';
import { Shield, Lock, AlertTriangle, ChevronDown, CheckCircle, ArrowLeft } from 'lucide-react';

interface AuthorityAuthProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onCityAdminLoginSuccess: () => void;
  onServiceProviderLoginSuccess: () => void;
  onSystemAdminLoginSuccess: () => void;
}

const ROLES = [
  'PUBLIC SAFETY OFFICIAL',
  'SYSTEM ADMIN',
  'SERVICE PROVIDER',
  'CITY ADMINISTRATOR'
];

const AuthorityAuth: React.FC<AuthorityAuthProps> = ({ 
  onBack, 
  onLoginSuccess, 
  onCityAdminLoginSuccess, 
  onServiceProviderLoginSuccess,
  onSystemAdminLoginSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    role: 'PUBLIC SAFETY OFFICIAL',
    twoFactor: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API verification delay
    setTimeout(() => {
      // Public Safety Credential Validation
      if (
        formData.role === 'PUBLIC SAFETY OFFICIAL' && 
        formData.id === '1010' && 
        formData.password === '2020'
      ) {
        onLoginSuccess();
      } 
      // City Administrator Credential Validation
      else if (
        formData.role === 'CITY ADMINISTRATOR' && 
        formData.id === '9090' && 
        formData.password === '8080'
      ) {
        onCityAdminLoginSuccess();
      }
      // Service Provider Credential Validation
      else if (
        formData.role === 'SERVICE PROVIDER' &&
        formData.id === '1111' &&
        formData.password === '2222'
      ) {
        onServiceProviderLoginSuccess();
      }
      // System Admin Credential Validation
      else if (
        formData.role === 'SYSTEM ADMIN' &&
        formData.id === '9999' &&
        formData.password === '0000'
      ) {
        onSystemAdminLoginSuccess();
      }
      else {
        setIsLoading(false);
        setError('Invalid credentials or unauthorized role access.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Security Banner */}
      <div className="bg-slate-900 text-white text-center py-2 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
        <Shield size={14} className="text-red-500" />
        System Access Restricted – Authorized Personnel Only
      </div>

      <nav className="p-6">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Home
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4 pb-20">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="text-blue-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Authority Login</h1>
            <p className="text-slate-500 text-sm mt-1">Secure City Management Portal</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-3 border border-red-100 animate-pulse">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Select Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Authority ID / Email</label>
                <input
                  type="text"
                  name="id"
                  required
                  placeholder="Enter ID (e.g., 1010)"
                  value={formData.id}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              
              {/* Optional 2FA Visual */}
              <div className="pt-2">
                 <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase">2FA Code (Optional)</label>
                    <span className="text-[10px] text-blue-500 font-bold cursor-pointer hover:underline">Send Code</span>
                 </div>
                 <input
                  type="text"
                  name="twoFactor"
                  placeholder="--- ---"
                  value={formData.twoFactor}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-center tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all mt-4 flex items-center justify-center gap-2
                  ${isLoading ? 'opacity-75 cursor-wait' : ''}
                `}
              >
                {isLoading ? (
                  <>Logging in...</>
                ) : (
                  <>
                    <Lock size={18} /> Secure Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-xs">
                Access issues? Contact System Administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityAuth;