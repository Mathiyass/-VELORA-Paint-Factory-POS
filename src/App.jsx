import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Stock from './pages/Stock';
import History from './pages/History';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Suppliers from './pages/factory/Suppliers';
import Chemicals from './pages/factory/Chemicals';
import PurchaseOrders from './pages/factory/PurchaseOrders';
import Formulas from './pages/production/Formulas';
import ProductionOrders from './pages/production/ProductionOrders';
import Expenses from './pages/finance/Expenses';
import Employees from './pages/finance/Employees';

const AppLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[#09090b] -z-10"></div>
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/history" element={<History />} />
            <Route path="/customers" element={<Customers />} />
            {/* Repairs Removed */}

            {/* Factory */}
            <Route path="/factory/suppliers" element={<Suppliers />} />
            <Route path="/factory/chemicals" element={<Chemicals />} />
            <Route path="/factory/purchase-orders" element={<PurchaseOrders />} />

            {/* Production */}
            <Route path="/production/formulas" element={<Formulas />} />
            <Route path="/production/orders" element={<ProductionOrders />} />

            {/* Finance */}
            <Route path="/finance/expenses" element={<Expenses />} />
            <Route path="/finance/employees" element={<Employees />} />

            <Route path="/settings" element={user.role === 'admin' ? <Settings /> : <Navigate to="/" />} />
            <Route path="/users" element={user.role === 'admin' ? <Users /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppLayout />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}