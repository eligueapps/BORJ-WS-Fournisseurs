import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { SupplierProfile } from '../types';

interface HeaderProps {
  supplier: SupplierProfile;
  setIsOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ supplier, setIsOpen }) => {
  return (
    <header className="sticky top-0 z-30 w-full h-20 bg-midnight/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsOpen(true)} 
          className="lg:hidden p-2 rounded-lg bg-midnight-light/50 text-offwhite-muted hover:text-offwhite border border-white/5"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une commande, un produit..." 
            className="w-80 bg-midnight-light/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-offwhite placeholder:text-offwhite-muted focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl bg-midnight-light/50 text-offwhite-muted hover:text-offwhite border border-white/5"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-copper rounded-full border-2 border-midnight shadow-[0_0_8px_rgba(184,115,51,0.8)]" />
        </motion.button>

        <div className="h-8 w-[1px] bg-white/5 mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-offwhite">{supplier.contactName}</p>
            <p className="text-[10px] uppercase tracking-wider text-offwhite-muted font-medium">Fournisseur</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-midnight-light border border-copper/30 flex items-center justify-center text-copper shadow-lg"
          >
            <User size={20} />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
