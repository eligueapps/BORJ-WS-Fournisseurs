import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Power, 
  PowerOff,
  AlertCircle,
  Tag,
  MoreVertical,
  X,
  Image as ImageIcon,
  Save,
  Trash2,
  Percent,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Product, ProductStatus, Promotion } from '../types';

interface CatalogProps {
  products: Product[];
}

const Catalog: React.FC<CatalogProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes les catégories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForPromo, setSelectedProductForPromo] = useState<Product | null>(null);
  const [showOnlyPromos, setShowOnlyPromos] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    reference: '',
    category: 'Stores',
    status: ProductStatus.ACTIVE,
    image: 'https://picsum.photos/seed/product/800/600',
    basePrice: 0,
    internalNotes: ''
  });

  // Promo Form State
  const [promoFormData, setPromoFormData] = useState<Partial<Promotion>>({
    discountPercentage: 0,
    promoPrice: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true
  });

  const categories = ['Toutes les catégories', ...Array.from(new Set(products.map(p => p.category)))];

  const isPromoActive = (promo?: Promotion) => {
    if (!promo || !promo.isActive) return false;
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    // Set hours to 0 for date-only comparison if needed, but standard Date comparison works
    return now >= start && now <= end;
  };

  const getEffectivePrice = (product: Product) => {
    if (isPromoActive(product.promotion)) {
      if (product.promotion?.promoPrice && product.promotion.promoPrice > 0) {
        return product.promotion.promoPrice;
      }
      if (product.promotion?.discountPercentage && product.promotion.discountPercentage > 0) {
        return product.basePrice * (1 - product.promotion.discountPercentage / 100);
      }
    }
    return product.basePrice;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Toutes les catégories' || product.category === categoryFilter;
    const matchesPromo = !showOnlyPromos || isPromoActive(product.promotion);
    return matchesSearch && matchesCategory && matchesPromo;
  });

  const handleToggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === ProductStatus.ACTIVE ? ProductStatus.OUT_OF_STOCK : ProductStatus.ACTIVE;
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        reference: `REF-${Math.floor(Math.random() * 10000)}`,
        category: 'Stores',
        status: ProductStatus.ACTIVE,
        image: `https://picsum.photos/seed/${Math.random()}/800/600`,
        basePrice: 0,
        internalNotes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenPromoModal = (product: Product) => {
    setSelectedProductForPromo(product);
    if (product.promotion) {
      setPromoFormData(product.promotion);
    } else {
      setPromoFormData({
        discountPercentage: 10,
        promoPrice: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true
      });
    }
    setIsPromoModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p));
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Product;
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForPromo) return;

    // Validation
    const start = new Date(promoFormData.startDate!);
    const end = new Date(promoFormData.endDate!);
    
    if (end < start) {
      alert("La date de fin doit être après la date de début.");
      return;
    }

    if (promoFormData.promoPrice && promoFormData.promoPrice > 0 && promoFormData.promoPrice >= selectedProductForPromo.basePrice) {
      alert("Le prix promotionnel doit être inférieur au prix de base.");
      return;
    }

    if (promoFormData.discountPercentage && (promoFormData.discountPercentage <= 0 || promoFormData.discountPercentage > 100)) {
      alert("Le pourcentage de remise doit être compris entre 1 et 100.");
      return;
    }

    const updatedPromotion: Promotion = {
      ...promoFormData,
      id: selectedProductForPromo.promotion?.id || Math.random().toString(36).substr(2, 9),
    } as Promotion;

    setProducts(prev => prev.map(p => 
      p.id === selectedProductForPromo.id ? { ...p, promotion: updatedPromotion } : p
    ));
    setIsPromoModalOpen(false);
  };

  const handleRemovePromo = () => {
    if (!selectedProductForPromo) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      setProducts(prev => prev.map(p => 
        p.id === selectedProductForPromo.id ? { ...p, promotion: undefined } : p
      ));
      setIsPromoModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-offwhite">Catalogue Produits</h2>
          <p className="text-offwhite-muted mt-1">Gérez la disponibilité, les prix et les promotions de vos produits.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="copper-button flex items-center gap-2"
        >
          <Plus size={18} />
          Nouveau Produit
        </button>
      </div>

      {/* Promo Summary Banner */}
      {products.some(p => isPromoActive(p.promotion)) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 border-copper/20 bg-copper/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-copper/20 text-copper">
              <Tag size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-offwhite">Promotions Actives</h4>
              <p className="text-xs text-offwhite-muted">
                {products.filter(p => isPromoActive(p.promotion)).length} produits bénéficient actuellement d'une remise.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowOnlyPromos(!showOnlyPromos)}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              showOnlyPromos 
                ? 'bg-copper text-midnight shadow-lg shadow-copper/20' 
                : 'bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10'
            }`}
          >
            {showOnlyPromos ? 'Voir tout le catalogue' : 'Voir uniquement les promos'}
          </button>
        </motion.div>
      )}

      {/* Search & Filters */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou référence..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-midnight border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-offwhite placeholder:text-offwhite-muted focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-offwhite-muted" size={18} />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 md:w-48 bg-midnight border border-white/5 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => {
          const activePromo = isPromoActive(product.promotion);
          const effectivePrice = getEffectivePrice(product);
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card overflow-hidden group flex flex-col relative"
            >
              {/* Promo Badge */}
              {activePromo && (
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-copper text-midnight font-black text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1 animate-pulse">
                    <Tag size={10} />
                    PROMO {product.promotion?.discountPercentage 
                      ? `${product.promotion.discountPercentage}%` 
                      : `-${Math.round((1 - (product.promotion?.promoPrice || 0) / product.basePrice) * 100)}%`}
                  </div>
                </div>
              )}

              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                    product.status === ProductStatus.ACTIVE ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    product.status === ProductStatus.OUT_OF_STOCK ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                    'bg-white/10 text-offwhite-muted border-white/20'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-copper font-bold mb-1">{product.category}</p>
                    <h4 className="text-lg font-bold text-offwhite leading-tight">{product.name}</h4>
                  </div>
                  <button className="text-offwhite-muted hover:text-offwhite">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <p className="text-xs text-offwhite-muted font-medium mb-3">Réf: {product.reference}</p>
                
                {/* Price Display */}
                <div className="mb-4">
                  {activePromo ? (
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-black text-offwhite">{effectivePrice.toLocaleString()} DH</span>
                      <span className="text-xs text-offwhite-muted line-through mb-1">{product.basePrice.toLocaleString()} DH</span>
                    </div>
                  ) : (
                    <span className="text-xl font-black text-offwhite">{product.basePrice.toLocaleString()} DH</span>
                  )}
                </div>

                {product.internalNotes && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 mb-4">
                    <p className="text-[10px] text-offwhite-muted italic leading-relaxed">
                      <AlertCircle size={10} className="inline mr-1 mb-0.5" />
                      {product.internalNotes}
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10 transition-all text-xs font-bold"
                    >
                      <Edit3 size={14} />
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleOpenPromoModal(product)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-xs font-bold ${
                        activePromo 
                          ? 'bg-copper/20 text-copper border border-copper/30 hover:bg-copper/30' 
                          : 'bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10'
                      }`}
                    >
                      <Percent size={14} />
                      Promo
                    </button>
                  </div>
                  <button 
                    onClick={() => handleToggleStatus(product.id)}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border transition-all text-xs font-bold ${
                      product.status === ProductStatus.ACTIVE 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    }`}
                  >
                    {product.status === ProductStatus.ACTIVE ? (
                      <><PowerOff size={14} /> Désactiver</>
                    ) : (
                      <><Power size={14} /> Activer</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative w-full max-w-lg bg-midnight border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between copper-gradient-subtle">
                <h3 className="text-xl font-bold text-offwhite">
                  {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-offwhite transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-copper uppercase tracking-widest mb-1.5">Nom du Produit</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      placeholder="ex: Store Enrouleur Occultant"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-copper uppercase tracking-widest mb-1.5">Référence</label>
                      <input 
                        type="text" 
                        required
                        value={formData.reference}
                        onChange={(e) => setFormData({...formData, reference: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-copper uppercase tracking-widest mb-1.5">Prix de Base (DH)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-copper uppercase tracking-widest mb-1.5">Catégorie</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      >
                        <option value="Stores">Stores</option>
                        <option value="Rideaux">Rideaux</option>
                        <option value="Accessoires">Accessoires</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-copper uppercase tracking-widest mb-1.5">Statut Initial</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as ProductStatus})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      >
                        <option value={ProductStatus.ACTIVE}>{ProductStatus.ACTIVE}</option>
                        <option value={ProductStatus.OUT_OF_STOCK}>{ProductStatus.OUT_OF_STOCK}</option>
                        <option value={ProductStatus.INACTIVE}>{ProductStatus.INACTIVE}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-copper uppercase tracking-widest mb-1.5">Notes Internes</label>
                    <textarea 
                      value={formData.internalNotes}
                      onChange={(e) => setFormData({...formData, internalNotes: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all h-24 resize-none"
                      placeholder="Notes sur la fabrication, délais..."
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                  {editingProduct && (
                    <button 
                      type="button"
                      onClick={() => handleDelete(editingProduct.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                      title="Supprimer le produit"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <div className="flex items-center gap-3 ml-auto">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl border border-white/10 text-offwhite-muted hover:text-offwhite hover:bg-white/5 transition-all text-sm font-medium"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="copper-button py-2.5 px-6 flex items-center gap-2 text-sm"
                    >
                      <Save size={18} />
                      {editingProduct ? 'Mettre à jour' : 'Créer le Produit'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Promotion Modal */}
      <AnimatePresence>
        {isPromoModalOpen && selectedProductForPromo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPromoModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-midnight border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between copper-gradient-subtle">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-copper/20 text-copper">
                    <Percent size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-offwhite">Gérer la Promotion</h3>
                    <p className="text-xs text-offwhite-muted">{selectedProductForPromo.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPromoModalOpen(false)}
                  className="p-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-offwhite transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePromo} className="p-6 space-y-6">
                {/* Promo Preview */}
                <div className="p-4 rounded-xl bg-copper/5 border border-copper/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-copper font-bold mb-1">Aperçu du prix</p>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-offwhite">
                        {(promoFormData.promoPrice && promoFormData.promoPrice > 0 
                          ? promoFormData.promoPrice 
                          : selectedProductForPromo.basePrice * (1 - (promoFormData.discountPercentage || 0) / 100)
                        ).toLocaleString()} DH
                      </span>
                      <span className="text-sm text-offwhite-muted line-through mb-1">
                        {selectedProductForPromo.basePrice.toLocaleString()} DH
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-copper font-bold mb-1">Économie</p>
                    <span className="text-lg font-bold text-emerald-400">
                      -{(promoFormData.promoPrice && promoFormData.promoPrice > 0 
                        ? selectedProductForPromo.basePrice - promoFormData.promoPrice 
                        : selectedProductForPromo.basePrice * ((promoFormData.discountPercentage || 0) / 100)
                      ).toLocaleString()} DH
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-offwhite-muted uppercase tracking-widest">Remise (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={16} />
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={promoFormData.discountPercentage}
                        onChange={(e) => setPromoFormData({...promoFormData, discountPercentage: parseFloat(e.target.value), promoPrice: 0})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-offwhite-muted uppercase tracking-widest">Ou Prix Fixe (DH)</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={16} />
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={promoFormData.promoPrice}
                        onChange={(e) => setPromoFormData({...promoFormData, promoPrice: parseFloat(e.target.value), discountPercentage: 0})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-offwhite-muted uppercase tracking-widest">Date de début</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={16} />
                      <input 
                        type="date" 
                        required
                        value={promoFormData.startDate}
                        onChange={(e) => setPromoFormData({...promoFormData, startDate: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-offwhite-muted uppercase tracking-widest">Date de fin</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-offwhite-muted" size={16} />
                      <input 
                        type="date" 
                        required
                        value={promoFormData.endDate}
                        onChange={(e) => setPromoFormData({...promoFormData, endDate: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-offwhite focus:outline-none focus:ring-2 focus:ring-copper/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${promoFormData.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-offwhite-muted'}`}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-offwhite">Promotion Active</p>
                      <p className="text-[10px] text-offwhite-muted">Activer ou suspendre l'offre immédiatement</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPromoFormData({...promoFormData, isActive: !promoFormData.isActive})}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${promoFormData.isActive ? 'bg-copper' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: promoFormData.isActive ? 26 : 4 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-offwhite shadow-lg"
                    />
                  </button>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-3">
                  {selectedProductForPromo.promotion && (
                    <button 
                      type="button"
                      onClick={handleRemovePromo}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                      title="Supprimer la promotion"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <div className="flex items-center gap-3 ml-auto">
                    <button 
                      type="button"
                      onClick={() => setIsPromoModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl border border-white/10 text-offwhite-muted hover:text-offwhite hover:bg-white/5 transition-all text-sm font-medium"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="copper-button py-2.5 px-6 flex items-center gap-2 text-sm"
                    >
                      <Save size={18} />
                      Enregistrer
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalog;
