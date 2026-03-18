import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Catalog from './pages/Catalog';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import { 
  mockSupplier, 
  mockOrders, 
  mockPayments, 
  mockProducts, 
  mockNotifications 
} from './mockData';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supplier, setSupplier] = useState(mockSupplier);

  useEffect(() => {
    // Simulate initial loading for premium feel
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (email: string, pass: string) => {
    console.log('Logging in with:', email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard orders={mockOrders} payments={mockPayments} products={mockProducts} notifications={mockNotifications} />;
      case 'orders':
        return <Orders orders={mockOrders} supplier={supplier} />;
      case 'payments':
        return <Payments payments={mockPayments} supplier={supplier} />;
      case 'catalog':
        return <Catalog products={mockProducts} />;
      case 'notifications':
        return <Notifications notifications={mockNotifications} />;
      case 'profile':
        return <Profile supplier={supplier} onUpdate={setSupplier} />;
      default:
        return <Dashboard orders={mockOrders} payments={mockPayments} products={mockProducts} notifications={mockNotifications} />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-midnight flex flex-col items-center justify-center z-[100]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 copper-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-copper/20 relative">
            <span className="text-midnight font-bold text-4xl">B</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-8px] border-2 border-dashed border-copper/30 rounded-3xl"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-offwhite">BORJ WS</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-copper font-bold mt-1">Supplier Hub</p>
          </div>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-4">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full bg-copper"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-midnight flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <Header supplier={supplier} setIsOpen={setIsSidebarOpen} />

        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-10 py-6 border-t border-white/5 text-center">
          <p className="text-xs text-offwhite-muted font-medium">
            &copy; 2026 BORJ WS Supplier Hub. Tous droits réservés. Propulsé par Wender Stores.
          </p>
        </footer>
      </div>
    </div>
  );
}
