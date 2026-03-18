import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  CreditCard, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Bell
} from 'lucide-react';
import { Order, OrderStatus, Payment, Product, Notification } from '../types';

interface DashboardProps {
  orders: Order[];
  payments: Payment[];
  products: Product[];
  notifications: Notification[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders, payments, products, notifications }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.NEW).length;
  const validatedOrders = orders.filter(o => o.status === OrderStatus.VALIDATED || o.status === OrderStatus.PREPARING).length;
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const activeProducts = products.filter(p => p.status === 'Actif').length;
  const outOfStockProducts = products.filter(p => p.status === 'En rupture').length;

  const stats = [
    { label: 'Total Commandes', value: totalOrders, icon: ShoppingBag, color: 'text-blue-400', trend: '+12%', trendUp: true },
    { label: 'En attente / Nouvelles', value: pendingOrders, icon: Clock, color: 'text-amber-400', trend: '-5%', trendUp: false },
    { label: 'Paiements Reçus', value: `${totalRevenue.toLocaleString()} €`, icon: CreditCard, color: 'text-emerald-400', trend: '+8%', trendUp: true },
    { label: 'Produits Actifs', value: activeProducts, icon: CheckCircle, color: 'text-indigo-400', trend: '0%', trendUp: true },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-offwhite">Tableau de bord</h2>
          <p className="text-offwhite-muted mt-1">Bienvenue sur votre espace fournisseur BORJ WS.</p>
        </div>
        <div className="flex items-center gap-3 bg-midnight-light/50 border border-white/5 rounded-2xl p-2 pr-6">
          <div className="w-12 h-12 copper-gradient rounded-xl flex items-center justify-center text-midnight shadow-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-offwhite-muted font-bold">Performance</p>
            <p className="text-sm font-bold text-offwhite">+15.4% ce mois</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-copper/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-copper/10" />
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-midnight border border-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-sm font-medium text-offwhite-muted mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-offwhite tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-offwhite flex items-center gap-3">
              <Package className="text-copper" size={24} />
              Dernières Commandes
            </h3>
            <button className="text-sm font-semibold text-copper hover:underline">Voir tout</button>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Référence</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Client</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Statut</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.slice(0, 4).map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-offwhite group-hover:text-copper transition-colors">{order.reference}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-offwhite-muted">{order.clientName}</td>
                      <td className="px-6 py-4 text-sm text-offwhite-muted">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          order.status === OrderStatus.NEW ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          order.status === OrderStatus.VALIDATED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          order.status === OrderStatus.PREPARING ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-white/5 text-offwhite-muted border-white/10'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-offwhite text-right">{order.totalAmount.toLocaleString()} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-offwhite flex items-center gap-3">
              <Bell className="text-copper" size={24} />
              Alertes & Notifications
            </h3>
          </div>
          <div className="space-y-4">
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                whileHover={{ x: 5 }}
                className={`glass-card p-4 border-l-4 ${
                  notif.type === 'order' ? 'border-l-blue-400' :
                  notif.type === 'payment' ? 'border-l-emerald-400' :
                  notif.type === 'product' ? 'border-l-amber-400' :
                  'border-l-copper'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-bold text-offwhite">{notif.title}</h4>
                  <span className="text-[10px] text-offwhite-muted font-medium">{notif.date}</span>
                </div>
                <p className="text-xs text-offwhite-muted leading-relaxed">{notif.message}</p>
              </motion.div>
            ))}
            {outOfStockProducts > 0 && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-400">{outOfStockProducts} Produits en rupture</p>
                  <p className="text-[10px] text-rose-400/70">Action requise dans le catalogue</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
