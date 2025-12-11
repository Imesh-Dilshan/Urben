
import React, { useState } from 'react';
import { Globe, Mail, Lock, User, Phone, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface CitizenAuthProps {
  onBack: () => void;
  onLoginSuccess: (name: string) => void;
}

const CitizenAuth: React.FC<CitizenAuthProps> = ({ onBack, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API delay
    setTimeout(() => {
      // Validate specific credentials for demo
      if (isLogin) {
          if (formData.email === 'imeshdilshan109@gmail.com' && formData.password === '1234') {
              setIsLoading(false);
              setIsSuccess(true);
              // Navigate after showing success message
              setTimeout(() => {
                onLoginSuccess('Imesh Dilshan');
              }, 1500);
          } else {
              setIsLoading(false);
              setError('Invalid email or password. Try imeshdilshan109@gmail.com / 1234');
          }
      } else {
          // Registration flow (simulate success)
          setIsLoading(false);
          setIsSuccess(true);
          setTimeout(() => {
            onLoginSuccess(formData.name || 'Citizen');
          }, 1500);
      }
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bgLight flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {isLogin ? 'Imesh' : formData.name.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-500">Redirecting you to the portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgLight flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="p-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/30 transform hover:rotate-6 transition-transform">
              <Globe size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join Urban Nexus'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin 
                ? 'Access your personalized city services dashboard.' 
                : 'Create an account to connect with your smart city.'}
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10">
            {error && (
                <div className="mb-4 bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                    <AlertCircle size={16} /> {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Full Name" 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Phone Number (Optional)" 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative group animate-fade-in-up">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    required
                    placeholder="Confirm Password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
                    Forgot Password?
                  </a>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className={`
                  w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1
                  ${isLoading ? 'opacity-70 cursor-wait' : ''}
                `}
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button 
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                }}
                className="mt-2 text-primary font-bold hover:text-blue-600 transition-colors border-2 border-transparent hover:border-blue-100 rounded-lg px-4 py-1"
              >
                {isLogin ? 'Register Now' : 'Login to Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenAuth;
