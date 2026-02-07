
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.api
global.window.api = {
    getProducts: vi.fn(),
    getCustomers: vi.fn(),
    createTransaction: vi.fn(),
    getSettings: vi.fn(),
    holdCart: vi.fn(),
    getHeldCarts: vi.fn(),
    deleteHeldCart: vi.fn(),
    getDashboardStats: vi.fn(),
    getRecentActivity: vi.fn(),
    getTransactions: vi.fn(),
    getSalesByCategory: vi.fn(),
    getSmartInsights: vi.fn(),
    getFormulas: vi.fn(),
    addProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    importProductsFromCSV: vi.fn(),
    getChemicals: vi.fn(),
    createFormula: vi.fn(),
    deleteFormula: vi.fn(),
    getProductionOrders: vi.fn(),
    createProductionOrder: vi.fn(),
    completeProductionOrder: vi.fn(),
    getAutoProductionPlan: vi.fn(),
    getExpenses: vi.fn(),
    addExpense: vi.fn(),
    deleteExpense: vi.fn(),
    getEmployees: vi.fn(),
    addEmployee: vi.fn(),
    deleteEmployee: vi.fn(),
};

// Mock window.confirm
global.window.confirm = vi.fn(() => true);
