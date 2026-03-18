import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck,
  Eye,
  FileText,
  X,
  Printer,
  Calendar,
  User as UserIcon,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { AnimatePresence } from 'motion/react';

interface OrdersProps {
  orders: Order[];
}

const Orders: React.FC<OrdersProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case OrderStatus.VALIDATED: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case OrderStatus.PREPARING: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case OrderStatus.READY: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case OrderStatus.DELIVERED: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case OrderStatus.COMPLETED: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-white/5 text-offwhite-muted border-white/10';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-offwhite">Commandes</h2>
          <p className="text-offwhite-muted mt-1">Gérez et suivez vos commandes fournisseurs en temps réel.</p>
        </div>
        <button className="copper-button flex items-center gap-2">
          <Download size={18} />
          Exporter (CSV)
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par référence ou client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-midnight border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-offwhite placeholder:text-offwhite-muted focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-offwhite-muted" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="flex-1 md:w-48 bg-midnight border border-white/5 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
          >
            <option value="All">Tous les statuts</option>
            {Object.values(OrderStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Référence</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Client</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Produits</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted text-right">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-offwhite group-hover:text-copper transition-colors">{order.reference}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-offwhite-muted">{order.clientName}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-xs text-offwhite-muted truncate max-w-[200px]">
                          {item.quantity}x {item.productName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-offwhite-muted">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-offwhite text-right">{order.totalAmount.toLocaleString()} €</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-copper hover:bg-copper/10 transition-all"
                        title="Voir les détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Télécharger le bon de commande PDF"
                        onClick={() => alert(`Téléchargement du bon de commande ${order.reference} en cours...`)}
                      >
                        <FileText size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-20 text-center">
            <Package className="mx-auto text-offwhite-muted/20 mb-4" size={64} />
            <p className="text-offwhite-muted font-medium">Aucune commande trouvée.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-midnight border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between copper-gradient-subtle">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-copper/20 rounded-xl flex items-center justify-center text-copper">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-offwhite">Commande {selectedOrder.reference}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                      <span className="text-xs text-offwhite-muted flex items-center gap-1">
                        <Calendar size={12} />
                        {selectedOrder.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="p-2.5 rounded-xl bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10 transition-all"
                    title="Imprimer"
                  >
                    <Printer size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-2.5 rounded-xl bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Client Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-copper">Informations Client</h4>
                    <div className="glass-card p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-offwhite-muted">
                          <UserIcon size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-offwhite-muted uppercase tracking-tighter">Nom du Client</p>
                          <p className="text-sm font-semibold text-offwhite">{selectedOrder.clientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-offwhite-muted">
                          <Truck size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-offwhite-muted uppercase tracking-tighter">Adresse de Livraison</p>
                          <p className="text-sm font-semibold text-offwhite">123 Rue du Commerce, 75001 Paris, France</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-copper">Paiement & Facturation</h4>
                    <div className="glass-card p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-offwhite-muted">
                          <CreditCardIcon size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-offwhite-muted uppercase tracking-tighter">Méthode de Paiement</p>
                          <p className="text-sm font-semibold text-offwhite">Virement Bancaire (30 jours)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-offwhite-muted">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-offwhite-muted uppercase tracking-tighter">Échéance</p>
                          <p className="text-sm font-semibold text-offwhite">15 Avril 2026</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-copper">Détails des Produits</h4>
                  <div className="glass-card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-offwhite-muted">Produit</th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-offwhite-muted text-center">Quantité</th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-offwhite-muted text-right">Prix Unitaire</th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-offwhite-muted text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-4">
                              <p className="text-sm font-medium text-offwhite">{item.productName}</p>
                              <p className="text-[10px] text-offwhite-muted">SKU: {item.productId}</p>
                            </td>
                            <td className="px-4 py-4 text-sm text-offwhite text-center">{item.quantity}</td>
                            <td className="px-4 py-4 text-sm text-offwhite-muted text-right">{(selectedOrder.totalAmount / selectedOrder.items.length / item.quantity).toFixed(2)} €</td>
                            <td className="px-4 py-4 text-sm font-bold text-offwhite text-right">{(selectedOrder.totalAmount / selectedOrder.items.length).toLocaleString()} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex justify-end">
                  <div className="w-full md:w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-offwhite-muted">Sous-total</span>
                      <span className="text-offwhite">{(selectedOrder.totalAmount * 0.8).toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-offwhite-muted">TVA (20%)</span>
                      <span className="text-offwhite">{(selectedOrder.totalAmount * 0.2).toLocaleString()} €</span>
                    </div>
                    <div className="h-[1px] bg-white/10 my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-copper">Total</span>
                      <span className="text-offwhite">{selectedOrder.totalAmount.toLocaleString()} €</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-offwhite-muted italic">
                  * Ce document est une visualisation numérique de la commande reçue.
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-white/10 text-offwhite-muted hover:text-offwhite hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    Fermer
                  </button>
                  <button 
                    className="flex-1 sm:flex-none copper-button py-2.5 px-6 flex items-center justify-center gap-2 text-sm"
                    onClick={() => alert(`Téléchargement du bon de commande ${selectedOrder.reference} en cours...`)}
                  >
                    <Download size={16} />
                    Télécharger PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
