import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  Trash2
} from 'lucide-react';
import { Product, ProductStatus } from '../types';
import { AnimatePresence } from 'motion/react';

interface CatalogProps {
  products: Product[];
}

const Catalog: React.FC<CatalogProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes les catégories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    reference: '',
    category: 'Stores',
    status: ProductStatus.ACTIVE,
    image: 'https://picsum.photos/seed/product/800/600',
    internalNotes: ''
  });

  const categories = ['Toutes les catégories', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Toutes les catégories' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
        internalNotes: ''
      });
    }
    setIsModalOpen(true);
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
          <p className="text-offwhite-muted mt-1">Gérez la disponibilité et les informations de vos produits.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="copper-button flex items-center gap-2"
        >
          <Plus size={18} />
          Nouveau Produit
        </button>
      </div>

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
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card overflow-hidden group flex flex-col"
          >
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
              <p className="text-xs text-offwhite-muted font-medium mb-4">Réf: {product.reference}</p>
              
              {product.internalNotes && (
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 mb-4">
                  <p className="text-[10px] text-offwhite-muted italic leading-relaxed">
                    <AlertCircle size={10} className="inline mr-1 mb-0.5" />
                    {product.internalNotes}
                  </p>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-offwhite-muted hover:text-offwhite hover:bg-white/10 transition-all text-xs font-bold"
                >
                  <Edit3 size={14} />
                  Modifier
                </button>
                <button 
                  onClick={() => handleToggleStatus(product.id)}
                  className={`p-2 rounded-lg border transition-all ${
                    product.status === ProductStatus.ACTIVE 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                  title={product.status === ProductStatus.ACTIVE ? 'Désactiver' : 'Activer'}
                >
                  {product.status === ProductStatus.ACTIVE ? <PowerOff size={16} /> : <Power size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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
    </div>
  );
};

export default Catalog;
