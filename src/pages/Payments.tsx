import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  TrendingUp,
  Wallet,
  Eye,
  X,
  Printer,
  Calendar,
  Hash,
  Euro,
  Receipt
} from 'lucide-react';
import { Payment, PaymentStatus, SupplierProfile } from '../types';
import { generateReceiptPDF } from '../services/pdfService';

interface PaymentsProps {
  payments: Payment[];
  supplier: SupplierProfile;
}

const Payments: React.FC<PaymentsProps> = ({ payments, supplier }) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleDownloadReceipt = (payment: Payment) => {
    generateReceiptPDF(payment, supplier);
  };
  const totalPaid = payments.filter(p => p.status === PaymentStatus.PAID).reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === PaymentStatus.PENDING).reduce((acc, p) => acc + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === PaymentStatus.OVERDUE).reduce((acc, p) => acc + p.amount, 0);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case PaymentStatus.PENDING: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case PaymentStatus.OVERDUE: return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-white/5 text-offwhite-muted border-white/10';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-offwhite">Paiements</h2>
          <p className="text-offwhite-muted mt-1">Suivez vos transactions financières et téléchargez vos factures.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-midnight-light/50 border border-white/5 text-offwhite-muted hover:text-offwhite transition-all">
            <Filter size={20} />
          </button>
          <button className="copper-button flex items-center gap-2">
            <Download size={18} />
            Exporter l'historique
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-emerald-400">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-offwhite-muted mb-1">Total Payé</p>
          <h3 className="text-2xl font-bold text-offwhite">{totalPaid.toLocaleString()} €</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock size={24} />
            </div>
            <Wallet size={20} className="text-amber-400" />
          </div>
          <p className="text-sm font-medium text-offwhite-muted mb-1">En attente</p>
          <h3 className="text-2xl font-bold text-offwhite">{totalPending.toLocaleString()} €</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-rose-400">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertCircle size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-offwhite-muted mb-1">En retard</p>
          <h3 className="text-2xl font-bold text-offwhite">{totalOverdue.toLocaleString()} €</h3>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Référence Facture</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Montant</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-offwhite group-hover:text-copper transition-colors">{payment.reference}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-offwhite-muted">{payment.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-offwhite">{payment.amount.toLocaleString()} €</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedPayment(payment)}
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-copper hover:bg-copper/10 transition-all"
                        title="Détails du paiement"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Télécharger le récépissé PDF"
                        onClick={() => handleDownloadReceipt(payment)}
                      >
                        <Receipt size={16} />
                      </button>
                      <button 
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        title="Voir la facture"
                      >
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPayment(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-midnight border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between copper-gradient-subtle">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-copper/20 rounded-xl flex items-center justify-center text-copper">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-offwhite">Détails du Paiement</h3>
                    <p className="text-xs text-offwhite-muted mt-1">Réf: {selectedPayment.reference}</p>
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
                    onClick={() => setSelectedPayment(null)}
                    className="p-2.5 rounded-xl bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-copper">Référence Commande</p>
                      <div className="flex items-center gap-3 text-offwhite">
                        <Hash size={18} className="text-offwhite-muted" />
                        <span className="text-lg font-bold">{selectedPayment.orderReference}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-copper">Date de Paiement</p>
                      <div className="flex items-center gap-3 text-offwhite">
                        <Calendar size={18} className="text-offwhite-muted" />
                        <span className="text-lg font-medium">{selectedPayment.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-copper">Montant Payé</p>
                      <div className="flex items-center gap-3 text-offwhite">
                        <Euro size={18} className="text-offwhite-muted" />
                        <span className="text-3xl font-black">{selectedPayment.amount.toLocaleString()} €</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-copper">Statut de Transaction</p>
                      <div className="mt-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(selectedPayment.status)}`}>
                          {selectedPayment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 bg-white/5 border-dashed border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-copper/10 text-copper">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-offwhite mb-1">Note de transaction</p>
                      <p className="text-xs text-offwhite-muted leading-relaxed">
                        Ce paiement a été traité via virement bancaire. Le récépissé de paiement fait foi de la transaction effectuée entre BORJ WS et votre établissement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-white/5 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedPayment(null)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 text-offwhite-muted hover:text-offwhite hover:bg-white/5 transition-all text-sm font-medium"
                >
                  Fermer
                </button>
                <button 
                  className="copper-button py-2.5 px-6 flex items-center gap-2 text-sm"
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                >
                  <Download size={18} />
                  Télécharger Récépissé PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
