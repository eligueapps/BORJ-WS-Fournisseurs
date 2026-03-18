import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  ShoppingBag, 
  Bell, 
  User, 
  LogOut,
  Menu,
  X,
  FileText,
  Users as UsersIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout, userRole }) => {
  const menuItems = [
    ...(userRole === UserRole.ADMIN ? [{ id: 'users', label: 'Utilisateurs', icon: UsersIcon }] : []),
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    ...(userRole === UserRole.SUPPLIER ? [
      { id: 'orders', label: 'Commandes', icon: Package },
      { id: 'payments', label: 'Paiements', icon: CreditCard },
      { id: 'catalog', label: 'Catalogue Produits', icon: ShoppingBag },
      { id: 'terms', label: 'Conditions Générales', icon: FileText },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'profile', label: 'Profil Fournisseur', icon: User },
    ] : []),
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -300) }}
        className="fixed top-0 left-0 h-full w-72 bg-midnight border-r border-white/5 z-50 lg:translate-x-0 transition-transform duration-300 ease-in-out"
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 copper-gradient rounded-lg flex items-center justify-center shadow-lg shadow-copper/20">
                <span className="text-midnight font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-offwhite">BORJ WS</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-copper font-semibold">Supplier Hub</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-offwhite-muted hover:text-offwhite">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-copper/10 text-copper border border-copper/20' 
                      : 'text-offwhite-muted hover:bg-white/5 hover:text-offwhite'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-copper' : 'group-hover:text-offwhite'} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-copper shadow-[0_0_8px_rgba(184,115,51,0.8)]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-offwhite-muted hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
