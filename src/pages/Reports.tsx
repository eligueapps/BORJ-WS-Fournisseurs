import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  ChevronRight,
  BarChart3,
  CreditCard,
  Package
} from 'lucide-react';
import { motion } from 'motion/react';
import { Order, Payment, SupplierProfile } from '../types';
import { 
  generateOrdersReportPDF, 
  generatePaymentsReportPDF, 
  generateDetailedReportPDF 
} from '../services/pdfService';

interface ReportsProps {
  orders: Order[];
  payments: Payment[];
  supplier: SupplierProfile;
}

const Reports: React.FC<ReportsProps> = ({ orders, payments, supplier }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filterOrdersByDate = (items: Order[]): Order[] => {
    if (!startDate || !endDate) return items;
    return items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  };

  const filterPaymentsByDate = (items: Payment[]): Payment[] => {
    if (!startDate || !endDate) return items;
    return items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  };

  const handleDownloadOrders = () => {
    const filtered = filterOrdersByDate(orders);
    generateOrdersReportPDF(filtered, supplier, startDate || 'Début', endDate || 'Fin');
  };

  const handleDownloadPayments = () => {
    const filtered = filterPaymentsByDate(payments);
    generatePaymentsReportPDF(filtered, supplier, startDate || 'Début', endDate || 'Fin');
  };

  const handleDownloadDetailed = () => {
    const filteredOrders = filterOrdersByDate(orders);
    const filteredPayments = filterPaymentsByDate(payments);
    generateDetailedReportPDF(filteredOrders, filteredPayments, supplier, startDate || 'Début', endDate || 'Fin');
  };

  const reportTypes = [
    {
      id: 'orders',
      title: 'Rapport des Commandes',
      description: 'Liste complète des commandes reçues avec statuts et montants.',
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      action: handleDownloadOrders
    },
    {
      id: 'payments',
      title: 'Rapport des Paiements',
      description: 'Historique des règlements perçus et modes de paiement.',
      icon: CreditCard,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      action: handleDownloadPayments
    },
    {
      id: 'detailed',
      title: 'Rapport Détaillé d\'Activité',
      description: 'Analyse complète incluant résumé financier et listes détaillées.',
      icon: BarChart3,
      color: 'text-copper',
      bgColor: 'bg-copper/10',
      action: handleDownloadDetailed
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-offwhite">Rapports</h2>
        <p className="text-offwhite-muted mt-1">Générez et téléchargez vos rapports d'activité personnalisés.</p>
      </div>

      {/* Date Range Selection */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-copper/20 rounded-xl flex items-center justify-center text-copper">
            <Calendar size={20} />
          </div>
          <h3 className="text-lg font-bold text-offwhite">Sélection de la période</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">Date de début</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-midnight border border-white/5 rounded-xl py-3 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">Date de fin</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-midnight border border-white/5 rounded-xl py-3 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex flex-col h-full group hover:border-copper/30 transition-all duration-300"
          >
            <div className={`w-12 h-12 ${report.bgColor} ${report.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <report.icon size={24} />
            </div>
            <h4 className="text-lg font-bold text-offwhite mb-2">{report.title}</h4>
            <p className="text-sm text-offwhite-muted mb-8 flex-1">{report.description}</p>
            
            <button 
              onClick={report.action}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-offwhite font-bold hover:bg-copper hover:text-midnight transition-all duration-300"
            >
              <Download size={18} />
              Télécharger PDF
            </button>
          </motion.div>
        ))}
      </div>

      {/* Professional Table Preview (Mock) */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-copper" size={20} />
            <h3 className="text-lg font-bold text-offwhite">Aperçu des données filtrées</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-copper/10 border border-copper/20 text-[10px] font-bold text-copper uppercase tracking-wider">
            {filterOrdersByDate(orders).length} Commandes trouvées
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Référence</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filterOrdersByDate(orders).slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-offwhite">{order.reference}</td>
                  <td className="px-6 py-4 text-sm text-offwhite-muted">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-offwhite text-right">{order.totalAmount.toLocaleString()} DH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filterOrdersByDate(orders).length > 5 && (
          <div className="p-4 bg-white/5 text-center">
            <p className="text-xs text-offwhite-muted italic">Affichage des 5 premiers résultats uniquement dans l'aperçu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
