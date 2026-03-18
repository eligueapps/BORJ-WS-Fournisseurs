import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Key, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  ChevronRight,
  ShieldCheck,
  Package,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { SupplierAccount, UserAccountStatus } from '../types';

interface UsersProps {
  suppliers: SupplierAccount[];
  onUpdate: (suppliers: SupplierAccount[]) => void;
}

const Users: React.FC<UsersProps> = ({ suppliers, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | 'All'>('All');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resettingSupplier, setResettingSupplier] = useState<SupplierAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [formData, setFormData] = useState<Partial<SupplierAccount>>({});

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (mode: 'create' | 'edit' | 'view', supplier?: SupplierAccount) => {
    setModalMode(mode);
    if (supplier) {
      setSelectedSupplier(supplier);
      setFormData(supplier);
    } else {
      setSelectedSupplier(null);
      setFormData({
        status: UserAccountStatus.ACTIVE,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleResetPassword = (supplier: SupplierAccount) => {
    setResettingSupplier(supplier);
    setNewPassword(Math.random().toString(36).slice(-8));
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    // Simulated reset
    setIsResetModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      const newSupplier: SupplierAccount = {
        ...formData as SupplierAccount,
        id: `SUP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onUpdate([...suppliers, newSupplier]);
    } else if (modalMode === 'edit' && selectedSupplier) {
      const updatedSuppliers = suppliers.map(s => 
        s.id === selectedSupplier.id ? { ...s, ...formData } : s
      );
      onUpdate(updatedSuppliers);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte fournisseur ?')) {
      onUpdate(suppliers.filter(s => s.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    const updatedSuppliers = suppliers.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === UserAccountStatus.ACTIVE ? UserAccountStatus.INACTIVE : UserAccountStatus.ACTIVE;
        return { ...s, status: nextStatus };
      }
      return s;
    });
    onUpdate(updatedSuppliers);
  };

  const getStatusBadge = (status: UserAccountStatus) => {
    switch (status) {
      case UserAccountStatus.ACTIVE:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={10} />
            Actif
          </span>
        );
      case UserAccountStatus.INACTIVE:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-offwhite-muted border border-white/10">
            <XCircle size={10} />
            Inactif
          </span>
        );
      case UserAccountStatus.SUSPENDED:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle size={10} />
            Suspendu
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-offwhite">Gestion des Utilisateurs</h2>
          <p className="text-offwhite-muted mt-1">Supervisez et gérez les comptes fournisseurs de la plateforme.</p>
        </div>
        <button 
          onClick={() => handleOpenModal('create')}
          className="copper-button flex items-center gap-2"
        >
          <UserPlus size={18} />
          Ajouter un fournisseur
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-offwhite-muted font-bold">Total Fournisseurs</p>
            <p className="text-2xl font-bold text-offwhite">{suppliers.length}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-offwhite-muted font-bold">Comptes Actifs</p>
            <p className="text-2xl font-bold text-offwhite">{suppliers.filter(s => s.status === UserAccountStatus.ACTIVE).length}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-offwhite-muted font-bold">Suspendus / Inactifs</p>
            <p className="text-2xl font-bold text-offwhite">{suppliers.filter(s => s.status !== UserAccountStatus.ACTIVE).length}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par société, responsable ou email..." 
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
            {Object.values(UserAccountStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Fournisseur</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Identifiant</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted">Création</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-offwhite-muted text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-copper/10 flex items-center justify-center text-copper font-bold text-lg">
                        {supplier.companyName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-offwhite group-hover:text-copper transition-colors">{supplier.companyName}</p>
                        <p className="text-[10px] text-offwhite-muted uppercase tracking-tighter">{supplier.category || 'Général'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-sm text-offwhite font-medium">{supplier.contactName}</p>
                      <p className="text-xs text-offwhite-muted">{supplier.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-midnight px-2 py-1 rounded border border-white/5 text-copper font-mono">
                      {supplier.login}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(supplier.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-offwhite-muted">
                    {supplier.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenModal('view', supplier)}
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-copper hover:bg-copper/10 transition-all"
                        title="Détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal('edit', supplier)}
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => toggleStatus(supplier.id)}
                        className={`p-2 rounded-lg bg-white/5 transition-all ${
                          supplier.status === UserAccountStatus.ACTIVE 
                            ? 'text-amber-400 hover:bg-amber-500/10' 
                            : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                        title={supplier.status === UserAccountStatus.ACTIVE ? 'Désactiver' : 'Activer'}
                      >
                        {supplier.status === UserAccountStatus.ACTIVE ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button 
                        onClick={() => handleResetPassword(supplier)}
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        title="Réinitialiser le mot de passe"
                      >
                        <Key size={16} />
                      </button>
                      <button 
                        onClick={() => alert(`Consultation des produits de ${supplier.companyName}`)}
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-copper hover:bg-copper/10 transition-all"
                        title="Consulter les produits"
                      >
                        <Package size={16} />
                      </button>
                      <button 
                        onClick={() => alert(`Consultation des commandes de ${supplier.companyName}`)}
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                        title="Consulter les commandes"
                      >
                        <ShoppingBag size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSuppliers.length === 0 && (
          <div className="p-20 text-center">
            <UsersIcon className="mx-auto text-offwhite-muted/20 mb-4" size={64} />
            <p className="text-offwhite-muted font-medium">Aucun fournisseur trouvé.</p>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit/View */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-midnight border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between copper-gradient-subtle">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-copper/20 rounded-xl flex items-center justify-center text-copper">
                    {modalMode === 'create' ? <UserPlus size={24} /> : modalMode === 'edit' ? <Edit size={24} /> : <Eye size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-offwhite">
                      {modalMode === 'create' ? 'Nouveau Compte Fournisseur' : modalMode === 'edit' ? 'Modifier le Compte' : 'Détails du Fournisseur'}
                    </h3>
                    <p className="text-xs text-offwhite-muted mt-1">
                      {modalMode === 'create' ? 'Remplissez les informations pour créer un accès.' : `ID: ${selectedSupplier?.id}`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-copper flex items-center gap-2">
                      <Building2 size={14} />
                      Informations Société
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">Nom de la Société</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === 'view'}
                          value={formData.companyName || ''}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">Catégorie</label>
                        <input 
                          type="text" 
                          disabled={modalMode === 'view'}
                          value={formData.category || ''}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="Ex: Textile, Luminaire..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-copper flex items-center gap-2">
                      <Mail size={14} />
                      Contact & Responsable
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">Nom du Responsable</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === 'view'}
                          value={formData.contactName || ''}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">E-mail</label>
                        <input 
                          type="email" 
                          required
                          disabled={modalMode === 'view'}
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auth Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-copper flex items-center gap-2">
                      <Lock size={14} />
                      Accès & Sécurité
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">Identifiant (Login)</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === 'view'}
                          value={formData.login || ''}
                          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all disabled:opacity-50"
                        />
                      </div>
                      {modalMode === 'create' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">Mot de passe initial</label>
                          <input 
                            type="password" 
                            required
                            value={formData.password || ''}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                          />
                        </div>
                      )}
                      {modalMode !== 'create' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">Statut du Compte</label>
                          <select 
                            disabled={modalMode === 'view'}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as UserAccountStatus })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all disabled:opacity-50"
                          >
                            {Object.values(UserAccountStatus).map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-copper flex items-center gap-2">
                      <MapPin size={14} />
                      Localisation
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">Ville</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === 'view'}
                          value={formData.city || ''}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted ml-1">Adresse</label>
                        <input 
                          type="text" 
                          required
                          disabled={modalMode === 'view'}
                          value={formData.address || ''}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {modalMode === 'view' && (
                  <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 text-offwhite-muted">
                      <Calendar size={16} />
                      <span className="text-xs">Créé le : <span className="text-offwhite font-medium">{selectedSupplier?.createdAt}</span></span>
                    </div>
                    {selectedSupplier?.lastLogin && (
                      <div className="flex items-center gap-3 text-offwhite-muted">
                        <ShieldCheck size={16} />
                        <span className="text-xs">Dernière connexion : <span className="text-offwhite font-medium">{selectedSupplier?.lastLogin}</span></span>
                      </div>
                    )}
                  </div>
                )}

                {/* Modal Footer */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-offwhite-muted hover:text-offwhite hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    {modalMode === 'view' ? 'Fermer' : 'Annuler'}
                  </button>
                  {modalMode !== 'view' && (
                    <button 
                      type="submit"
                      className="copper-button py-2.5 px-8 text-sm"
                    >
                      {modalMode === 'create' ? 'Créer le compte' : 'Enregistrer les modifications'}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-midnight border border-white/10 rounded-2xl shadow-2xl p-8 text-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-xl font-bold text-offwhite mb-2">Réinitialiser le mot de passe</h3>
              <p className="text-offwhite-muted text-sm mb-8">
                Vous allez générer un nouveau mot de passe temporaire pour <span className="text-offwhite font-bold">{resettingSupplier?.companyName}</span>.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 relative group">
                <p className="text-[10px] uppercase tracking-widest text-offwhite-muted font-bold mb-2">Nouveau mot de passe</p>
                <p className="text-2xl font-mono text-copper font-bold tracking-wider">{newPassword}</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(newPassword);
                    alert('Copié dans le presse-papier');
                  }}
                  className="absolute top-2 right-2 p-2 text-offwhite-muted hover:text-offwhite transition-colors"
                  title="Copier"
                >
                  <Lock size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmReset}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-midnight font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  Confirmer la réinitialisation
                </button>
                <button 
                  onClick={() => setIsResetModalOpen(false)}
                  className="w-full py-3.5 text-offwhite-muted hover:text-offwhite font-medium transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
