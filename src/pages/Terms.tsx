import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  CheckCircle, 
  Lock, 
  Download, 
  ShieldCheck, 
  AlertCircle,
  User,
  Key,
  Calendar
} from 'lucide-react';
import { SupplierProfile, ContractStatus } from '../types';
import { generateContractPDF } from '../services/pdfService';

interface TermsProps {
  supplier: SupplierProfile;
  onUpdate: (updatedSupplier: SupplierProfile) => void;
}

const Terms: React.FC<TermsProps> = ({ supplier, onUpdate }) => {
  const [accepted, setAccepted] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');

  const isSigned = supplier.contractStatus === ContractStatus.SIGNED;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accepted) {
      setError('Veuillez accepter les conditions générales.');
      return;
    }

    if (!login || !password) {
      setError('Veuillez saisir vos identifiants.');
      return;
    }

    // Simulate credential verification (in a real app, this would be a server call)
    if (login === 'admin' && password === 'admin') {
      setIsSigning(true);
      
      // Simulate processing
      setTimeout(() => {
        const updatedSupplier: SupplierProfile = {
          ...supplier,
          contractStatus: ContractStatus.SIGNED,
          contractSignedDate: new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          contractSignedBy: supplier.contactName
        };
        
        onUpdate(updatedSupplier);
        setIsSigning(false);
        generateContractPDF(updatedSupplier);
      }, 1500);
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  const handleDownload = () => {
    generateContractPDF(supplier);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-offwhite">Conditions Générales</h2>
          <p className="text-offwhite-muted mt-1">Contrat de collaboration entre Wender Stores et votre établissement.</p>
        </div>
        {isSigned && (
          <button 
            onClick={handleDownload}
            className="copper-button flex items-center gap-2"
          >
            <Download size={18} />
            Télécharger le contrat signé
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contract Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
              <FileText className="text-copper" size={20} />
              <h3 className="font-bold text-offwhite">Contrat de Collaboration Professionnelle</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 text-sm leading-relaxed text-offwhite-muted custom-scrollbar">
              <section className="space-y-4">
                <h4 className="text-offwhite font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-copper/20 text-copper flex items-center justify-center text-[10px]">01</span>
                  Engagement tarifaire
                </h4>
                <p>
                  Le fournisseur s’engage formellement à respecter les tarifs définis dans le catalogue des produits partagé avec Wender Stores. 
                  Toute modification de prix doit faire l'objet d'une demande de révision soumise au moins 30 jours à l'avance.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Respect strict des tarifs catalogue</li>
                  <li>Interdiction de modification unilatérale des prix</li>
                  <li>Validation obligatoire par Wender Stores avant toute application</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h4 className="text-offwhite font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-copper/20 text-copper flex items-center justify-center text-[10px]">02</span>
                  Gestion des produits et du stock
                </h4>
                <p>
                  Chaque produit référencé est considéré comme actif par défaut. Le fournisseur assume l'entière responsabilité de la mise à jour en temps réel des niveaux de stock.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Responsabilité de la disponibilité des produits</li>
                  <li>Désactivation automatique en cas de rupture signalée</li>
                  <li>Engagement sur les commandes passées pour les produits affichés "En stock"</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h4 className="text-offwhite font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-copper/20 text-copper flex items-center justify-center text-[10px]">03</span>
                  Responsabilité sur les commandes
                </h4>
                <p>
                  Le fournisseur s’engage à honorer l'intégralité des commandes reçues via la plateforme Wender Stores. 
                  Il garantit la conformité des produits livrés par rapport aux fiches techniques et visuels fournis.
                </p>
              </section>

              <section className="space-y-4">
                <h4 className="text-offwhite font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-copper/20 text-copper flex items-center justify-center text-[10px]">04</span>
                  Délais de livraison
                </h4>
                <p>
                  Le respect des délais de livraison est une condition substantielle du présent contrat. 
                  Tout retard prévisible doit être notifié immédiatement à Wender Stores avec une justification détaillée.
                </p>
              </section>

              <section className="space-y-4">
                <h4 className="text-offwhite font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-copper/20 text-copper flex items-center justify-center text-[10px]">05</span>
                  Modification du contrat
                </h4>
                <p>
                  Une fois validé et signé électroniquement, le présent contrat devient définitif et verrouillé. 
                  Aucune modification ne peut être effectuée unilatéralement par le fournisseur.
                </p>
              </section>

              <div className="pt-8 border-t border-white/5 text-[10px] italic text-center">
                Document généré électroniquement par le système Wender Stores.
              </div>
            </div>
          </div>
        </div>

        {/* Signature Sidebar */}
        <div className="space-y-6">
          {isSigned ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5 space-y-6"
            >
              <div className="flex items-center gap-3 text-emerald-400">
                <ShieldCheck size={24} />
                <h3 className="font-bold">Contrat Signé</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-offwhite-muted">
                    <User size={14} />
                    <span>Signataire</span>
                  </div>
                  <p className="text-sm font-bold text-offwhite">{supplier.contractSignedBy}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-offwhite-muted">
                    <Calendar size={14} />
                    <span>Date de signature</span>
                  </div>
                  <p className="text-sm font-bold text-offwhite">{supplier.contractSignedDate}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[10px] text-emerald-400 font-medium leading-relaxed">
                  Ce contrat est désormais verrouillé. Toute demande de modification doit être adressée au support Wender Stores.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-3 text-copper">
                <Lock size={20} />
                <h3 className="font-bold">Signature Électronique</h3>
              </div>

              <form onSubmit={handleSign} className="space-y-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="peer h-5 w-5 appearance-none rounded border border-white/10 bg-white/5 checked:bg-copper checked:border-copper transition-all"
                    />
                    <CheckCircle className="absolute h-5 w-5 text-midnight opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-xs text-offwhite-muted group-hover:text-offwhite transition-colors leading-relaxed">
                    J'ai lu et j'accepte l'intégralité des conditions générales de collaboration Wender Stores.
                  </span>
                </label>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted px-1">Identifiant</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-offwhite-muted group-focus-within:text-copper transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Votre login"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-offwhite placeholder:text-offwhite-muted/30 focus:outline-none focus:border-copper/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-offwhite-muted px-1">Mot de passe</label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-offwhite-muted group-focus-within:text-copper transition-colors" size={18} />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-offwhite placeholder:text-offwhite-muted/30 focus:outline-none focus:border-copper/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-[10px]">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSigning}
                  className={`w-full copper-button py-4 flex items-center justify-center gap-2 font-bold ${isSigning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSigning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-midnight border-t-transparent rounded-full animate-spin" />
                      Signature en cours...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      Accepter et signer le contrat
                    </>
                  )}
                </button>
              </form>

              <p className="text-[9px] text-offwhite-muted text-center leading-relaxed">
                En signant ce document, vous reconnaissez que cette validation électronique a la même valeur juridique qu'une signature manuscrite.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terms;
