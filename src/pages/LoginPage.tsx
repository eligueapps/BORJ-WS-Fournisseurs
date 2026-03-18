import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (email: string, pass: string, role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      // Check for admin credentials (mocked for demo)
      // In a real app, this would be handled by the backend
      const isAdmin = email === 'admin@wenderstores.com' && password === 'admin_password_secure';
      onLogin(email, password, isAdmin ? UserRole.ADMIN : UserRole.SUPPLIER);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-copper/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-copper/10 rounded-full blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 copper-gradient rounded-2xl shadow-2xl shadow-copper/20 mb-6 relative"
          >
            <span className="text-midnight font-bold text-4xl">B</span>
            <div className="absolute inset-[-4px] border border-copper/30 rounded-2xl" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-offwhite">BORJ WS</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-copper font-bold mt-1">Supplier Hub</p>
          <div className="mt-6 h-[1px] w-12 bg-copper/30 mx-auto" />
          <p className="text-offwhite-muted mt-4 text-sm font-medium">Espace Fournisseurs Professionnel</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 copper-gradient opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted ml-1">Identifiant ou E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-offwhite-muted group-focus-within:text-copper transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-midnight/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-offwhite placeholder:text-offwhite-muted/50 focus:outline-none focus:ring-2 focus:ring-copper/50 focus:border-copper/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">Mot de passe</label>
                <button type="button" className="text-[10px] uppercase tracking-wider text-copper hover:text-copper-light font-bold transition-colors">
                  Oublié ?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-offwhite-muted group-focus-within:text-copper transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-midnight/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-offwhite placeholder:text-offwhite-muted/50 focus:outline-none focus:ring-2 focus:ring-copper/50 focus:border-copper/30 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-offwhite-muted hover:text-offwhite transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full copper-button py-4 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Se connecter</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-offwhite-muted">
            <ShieldCheck size={14} className="text-copper" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Connexion Sécurisée B2B</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-xs text-offwhite-muted font-medium">
          &copy; 2026 BORJ WS. Plateforme de gestion premium.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
