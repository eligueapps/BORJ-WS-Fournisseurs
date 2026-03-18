import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Building2, 
  Shield, 
  Save, 
  Camera,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { SupplierProfile } from '../types';

interface ProfileProps {
  supplier: SupplierProfile;
  onUpdate: (supplier: SupplierProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ supplier, onUpdate }) => {
  const [formData, setFormData] = useState<SupplierProfile>(supplier);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onUpdate(formData);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDocumentClick = (docName: string) => {
    alert(`Visualisation du document : ${docName}`);
  };

  const handlePhotoClick = () => {
    alert("Fonctionnalité de changement de photo de profil bientôt disponible.");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-offwhite">Profil Fournisseur</h2>
          <p className="text-offwhite-muted mt-1">Gérez vos informations d'entreprise et vos paramètres de sécurité.</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-emerald-400 text-sm font-medium"
              >
                <CheckCircle2 size={18} />
                Modifications enregistrées
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="copper-button flex items-center gap-2 min-w-[180px] justify-center"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={18} />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="space-y-6">
          <div className="glass-card p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 copper-gradient opacity-20" />
            <div className="relative z-10">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-3xl bg-midnight border-4 border-midnight-light flex items-center justify-center text-copper shadow-2xl overflow-hidden">
                  <User size={64} />
                </div>
                <button 
                  onClick={handlePhotoClick}
                  className="absolute bottom-1 right-1 p-2.5 rounded-xl bg-copper text-midnight shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-offwhite mb-1">{formData.companyName}</h3>
              <p className="text-sm text-offwhite-muted font-medium mb-6">ID: {formData.id}</p>
              
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <Shield size={14} />
                Compte Vérifié
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-offwhite-muted mb-4">Documents</h4>
            <button 
              onClick={() => handleDocumentClick('KBIS Société')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-copper" size={18} />
                <span className="text-sm font-medium text-offwhite">KBIS Société</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Validé</span>
            </button>
            <button 
              onClick={() => handleDocumentClick('RIB / IBAN')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-copper" size={18} />
                <span className="text-sm font-medium text-offwhite">RIB / IBAN</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Validé</span>
            </button>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Info */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-offwhite flex items-center gap-3 mb-8">
              <Building2 className="text-copper" size={24} />
              Informations de l'entreprise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">Nom de la société</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full bg-midnight border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">Contact Principal</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
                  <input 
                    type="text" 
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full bg-midnight border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">Email professionnel</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-midnight border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-midnight border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">Adresse du siège</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-midnight border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-offwhite flex items-center gap-3 mb-8">
              <CreditCard className="text-copper" size={24} />
              Informations de paiement (RIB)
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-offwhite-muted">IBAN / RIB</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
                <input 
                  type="text" 
                  name="rib"
                  value={formData.rib}
                  onChange={handleChange}
                  className="w-full bg-midnight border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-offwhite font-mono focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                />
              </div>
              <p className="text-[10px] text-offwhite-muted italic mt-2">
                <AlertCircle size={10} className="inline mr-1 mb-0.5" />
                La modification du RIB nécessite une validation par l'équipe administrative de Wender Stores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
