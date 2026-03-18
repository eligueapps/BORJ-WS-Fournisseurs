import { Order, OrderStatus, Payment, PaymentStatus, Product, ProductStatus, Notification, SupplierProfile } from './types';

export const mockSupplier: SupplierProfile = {
  id: 'SUP-001',
  companyName: 'Wender Stores - Supplier Hub',
  contactName: 'Jean Dupont',
  email: 'jean.dupont@supplier.com',
  phone: '+33 1 23 45 67 89',
  address: '123 Rue de la Paix, 75001 Paris, France',
  rib: 'FR76 1234 5678 9012 3456 7890 123',
};

export const mockOrders: Order[] = [
  {
    id: 'ORD-101',
    reference: 'BW-2026-001',
    clientName: 'Alice Martin',
    items: [
      { id: 'ITEM-1', productId: 'PROD-001', productName: 'Store Enrouleur Occultant', quantity: 2, price: 85.00 },
      { id: 'ITEM-2', productId: 'PROD-002', productName: 'Rideau Voilage Blanc', quantity: 1, price: 45.00 },
    ],
    totalAmount: 215.00,
    date: '2026-03-15',
    status: OrderStatus.NEW,
    deliveryDate: '2026-03-25',
    deliveryAddress: '45 Avenue des Champs-Élysées, 75008 Paris',
    paymentMethod: 'Virement Bancaire',
    paymentStatus: PaymentStatus.PENDING,
  },
  {
    id: 'ORD-102',
    reference: 'BW-2026-002',
    clientName: 'Robert Durand',
    items: [
      { id: 'ITEM-3', productId: 'PROD-003', productName: 'Store Vénitien Bois', quantity: 3, price: 120.00 },
    ],
    totalAmount: 360.00,
    date: '2026-03-16',
    status: OrderStatus.PREPARING,
    deliveryDate: '2026-03-22',
    deliveryAddress: '12 Rue de la République, 69002 Lyon',
    paymentMethod: 'Carte Bancaire',
    paymentStatus: PaymentStatus.PAID,
    paymentDate: '2026-03-16',
    paymentAmount: 360.00,
  },
  {
    id: 'ORD-103',
    reference: 'BW-2026-003',
    clientName: 'Sophie Lefebvre',
    items: [
      { id: 'ITEM-4', productId: 'PROD-001', productName: 'Store Enrouleur Occultant', quantity: 1, price: 85.00 },
    ],
    totalAmount: 85.00,
    date: '2026-03-17',
    status: OrderStatus.VALIDATED,
    deliveryDate: '2026-03-28',
    deliveryAddress: '8 Boulevard Victor Hugo, 06000 Nice',
    paymentMethod: 'Virement Bancaire',
    paymentStatus: PaymentStatus.PENDING,
  },
  {
    id: 'ORD-104',
    reference: 'BW-2026-004',
    clientName: 'Michel Petit',
    items: [
      { id: 'ITEM-5', productId: 'PROD-004', productName: 'Rideau Velours Bleu', quantity: 2, price: 110.00 },
    ],
    totalAmount: 220.00,
    date: '2026-03-14',
    status: OrderStatus.DELIVERED,
    deliveryDate: '2026-03-18',
    deliveryAddress: '22 Rue des Bouchers, 67000 Strasbourg',
    paymentMethod: 'Carte Bancaire',
    paymentStatus: PaymentStatus.PAID,
    paymentDate: '2026-03-14',
    paymentAmount: 220.00,
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    reference: 'INV-2026-001',
    orderReference: 'BW-2026-001',
    date: '2026-03-10',
    amount: 1250.00,
    status: PaymentStatus.PAID,
    invoiceUrl: '#',
  },
  {
    id: 'PAY-002',
    reference: 'INV-2026-002',
    orderReference: 'BW-2026-002',
    date: '2026-03-15',
    amount: 850.00,
    status: PaymentStatus.PENDING,
    invoiceUrl: '#',
  },
  {
    id: 'PAY-003',
    reference: 'INV-2026-003',
    orderReference: 'BW-2026-003',
    date: '2026-02-28',
    amount: 2100.00,
    status: PaymentStatus.PAID,
    invoiceUrl: '#',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    reference: 'ST-001',
    name: 'Store Enrouleur Occultant',
    category: 'Stores',
    status: ProductStatus.ACTIVE,
    image: 'https://picsum.photos/seed/blind1/400/300',
    internalNotes: 'Modèle premium, tissu épais.',
  },
  {
    id: 'PROD-002',
    reference: 'RI-001',
    name: 'Rideau Voilage Blanc',
    category: 'Rideaux',
    status: ProductStatus.ACTIVE,
    image: 'https://picsum.photos/seed/curtain1/400/300',
  },
  {
    id: 'PROD-003',
    reference: 'ST-002',
    name: 'Store Vénitien Bois',
    category: 'Stores',
    status: ProductStatus.ACTIVE,
    image: 'https://picsum.photos/seed/blind2/400/300',
  },
  {
    id: 'PROD-004',
    reference: 'RI-002',
    name: 'Rideau Velours Bleu',
    category: 'Rideaux',
    status: ProductStatus.OUT_OF_STOCK,
    image: 'https://picsum.photos/seed/curtain2/400/300',
    internalNotes: 'Réapprovisionnement prévu fin mars.',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    title: 'Nouvelle commande',
    message: 'Vous avez reçu une nouvelle commande BW-2026-001.',
    date: '2026-03-18 09:30',
    type: 'order',
    read: false,
  },
  {
    id: 'NOT-002',
    title: 'Paiement reçu',
    message: 'Le paiement pour la facture INV-2026-001 a été validé.',
    date: '2026-03-17 14:15',
    type: 'payment',
    read: true,
  },
  {
    id: 'NOT-003',
    title: 'Produit en rupture',
    message: 'Le produit "Rideau Velours Bleu" est désormais en rupture de stock.',
    date: '2026-03-16 11:00',
    type: 'product',
    read: false,
  },
];
