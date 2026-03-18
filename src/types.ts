export enum OrderStatus {
  NEW = 'Nouvelle',
  PENDING = 'En attente',
  VALIDATED = 'Validée',
  PREPARING = 'En préparation',
  READY = 'Prête',
  DELIVERED = 'Livrée',
  COMPLETED = 'Terminée'
}

export enum PaymentStatus {
  PAID = 'Payé',
  PENDING = 'En attente',
  OVERDUE = 'Retard'
}

export enum ProductStatus {
  ACTIVE = 'Actif',
  INACTIVE = 'Inactif',
  OUT_OF_STOCK = 'En rupture'
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  reference: string;
  clientName: string;
  items: OrderItem[];
  totalAmount: number;
  date: string;
  status: OrderStatus;
  deliveryDate?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  paymentDate?: string;
  paymentAmount?: number;
  paymentStatus?: PaymentStatus;
}

export interface Payment {
  id: string;
  reference: string;
  orderReference: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  invoiceUrl?: string;
}

export interface Product {
  id: string;
  reference: string;
  name: string;
  category: string;
  status: ProductStatus;
  image: string;
  internalNotes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'order' | 'payment' | 'product' | 'system';
  read: boolean;
}

export interface SupplierProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  rib: string;
  logo?: string;
}
