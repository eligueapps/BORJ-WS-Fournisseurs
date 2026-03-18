import React from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  Package, 
  CreditCard, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return <Package size={20} className="text-blue-400" />;
      case 'payment': return <CreditCard size={20} className="text-emerald-400" />;
      case 'product': return <ShoppingBag size={20} className="text-amber-400" />;
      case 'system': return <AlertCircle size={20} className="text-copper" />;
      default: return <Bell size={20} className="text-offwhite-muted" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-offwhite">Notifications</h2>
          <p className="text-offwhite-muted mt-1">Restez informé des dernières activités de votre boutique.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10 transition-all text-sm font-bold">
            <Check size={18} />
            Tout marquer comme lu
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all text-sm font-bold">
            <Trash2 size={18} />
            Supprimer tout
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif, idx) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-6 flex items-start gap-6 relative group ${!notif.read ? 'border-l-4 border-l-copper' : ''}`}
          >
            {!notif.read && (
              <div className="absolute top-6 right-6 w-2 h-2 bg-copper rounded-full shadow-[0_0_8px_rgba(184,115,51,0.8)]" />
            )}
            <div className={`p-4 rounded-2xl bg-midnight border border-white/5 shadow-inner`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-lg font-bold ${!notif.read ? 'text-offwhite' : 'text-offwhite-muted'}`}>{notif.title}</h4>
                <div className="flex items-center gap-2 text-xs text-offwhite-muted font-medium">
                  <Clock size={14} />
                  {notif.date}
                </div>
              </div>
              <p className="text-sm text-offwhite-muted leading-relaxed max-w-2xl">{notif.message}</p>
              
              <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs font-bold text-copper hover:underline">Marquer comme lu</button>
                <button className="text-xs font-bold text-rose-400 hover:underline">Supprimer</button>
              </div>
            </div>
          </motion.div>
        ))}

        {notifications.length === 0 && (
          <div className="p-20 text-center glass-card">
            <Bell className="mx-auto text-offwhite-muted/20 mb-4" size={64} />
            <p className="text-offwhite-muted font-medium">Vous n'avez aucune notification.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
