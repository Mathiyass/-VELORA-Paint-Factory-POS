/* eslint-env node */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // Dashboard
  getDashboardStats: () => ipcRenderer.invoke('db:get-dashboard-stats'),
  getRecentActivity: () => ipcRenderer.invoke('db:get-recent-activity'),
  getTopProducts: () => ipcRenderer.invoke('db:get-top-products'),
  getSalesByCategory: () => ipcRenderer.invoke('db:get-sales-by-category'),
  getSalesByHour: () => ipcRenderer.invoke('db:get-sales-by-hour'),
  getSmartInsights: () => ipcRenderer.invoke('db:get-smart-insights'),

  // Products
  getProducts: () => ipcRenderer.invoke('db:get-products'),
  addProduct: (data) => ipcRenderer.invoke('db:add-product', data),
  updateProduct: (data) => ipcRenderer.invoke('db:update-product', data),
  adjustStock: (data) => ipcRenderer.invoke('db:adjust-stock', data),
  deleteProduct: (id) => ipcRenderer.invoke('db:delete-product', id),
  importProductsFromCSV: () => ipcRenderer.invoke('db:import-products-csv'),

  // Transactions
  createTransaction: (data) => ipcRenderer.invoke('db:process-sale', data),
  getTransactions: () => ipcRenderer.invoke('db:get-history'),
  updateTransaction: (data) => ipcRenderer.invoke('db:update-transaction', data),
  getCustomerHistory: (id) => ipcRenderer.invoke('db:get-customer-history', id),

  // Cart Hold/Recall
  holdCart: (data) => ipcRenderer.invoke('db:hold-cart', data),
  getHeldCarts: () => ipcRenderer.invoke('db:get-held-carts'),
  deleteHeldCart: (id) => ipcRenderer.invoke('db:delete-held-cart', id),

  // Auth
  login: (creds) => ipcRenderer.invoke('auth:login', creds),
  getUsers: () => ipcRenderer.invoke('auth:get-users'),
  addUser: (data) => ipcRenderer.invoke('auth:add-user', data),
  updateUser: (data) => ipcRenderer.invoke('auth:update-user', data),
  deleteUser: (id) => ipcRenderer.invoke('auth:delete-user', id),

  // Customers
  getCustomers: () => ipcRenderer.invoke('db:get-customers'),
  addCustomer: (data) => ipcRenderer.invoke('db:add-customer', data),
  deleteCustomer: (id) => ipcRenderer.invoke('db:delete-customer', id),

  // Settings & System
  getSettings: () => ipcRenderer.invoke('app:get-settings'),
  updateSettings: (settings) => ipcRenderer.invoke('app:update-settings', settings),
  backupDatabase: () => ipcRenderer.invoke('app:backup'),
  factoryReset: () => ipcRenderer.invoke('app:factory-reset'),
  restoreDatabase: () => ipcRenderer.invoke('app:restore-backup'),

  // --- Factory ---
  getSuppliers: () => ipcRenderer.invoke('db:get-suppliers'),
  addSupplier: (data) => ipcRenderer.invoke('db:add-supplier', data),
  updateSupplier: (data) => ipcRenderer.invoke('db:update-supplier', data),
  deleteSupplier: (id) => ipcRenderer.invoke('db:delete-supplier', id),

  getChemicals: () => ipcRenderer.invoke('db:get-chemicals'),
  addChemical: (data) => ipcRenderer.invoke('db:add-chemical', data),
  updateChemical: (data) => ipcRenderer.invoke('db:update-chemical', data),
  deleteChemical: (id) => ipcRenderer.invoke('db:delete-chemical', id),
  getBatches: (chemId) => ipcRenderer.invoke('db:get-batches', chemId),

  getPurchaseOrders: () => ipcRenderer.invoke('db:get-pos'),
  createPurchaseOrder: (data) => ipcRenderer.invoke('db:create-po', data),
  getPurchaseOrderItems: (id) => ipcRenderer.invoke('db:get-po-items', id),
  receivePurchaseOrder: (id, items) => ipcRenderer.invoke('db:receive-po', id, items),

  // --- Production ---
  getFormulas: () => ipcRenderer.invoke('db:get-formulas'),
  createFormula: (data) => ipcRenderer.invoke('db:create-formula', data),
  deleteFormula: (id) => ipcRenderer.invoke('db:delete-formula', id),

  getProductionOrders: () => ipcRenderer.invoke('db:get-production-orders'),
  createProductionOrder: (data) => ipcRenderer.invoke('db:create-production-order', data),
  completeProductionOrder: (id) => ipcRenderer.invoke('db:complete-production-order', id),
  getAutoProductionPlan: () => ipcRenderer.invoke('db:get-auto-production-plan'),

  // --- Finance ---
  getExpenses: () => ipcRenderer.invoke('db:get-expenses'),
  addExpense: (data) => ipcRenderer.invoke('db:add-expense', data),
  deleteExpense: (id) => ipcRenderer.invoke('db:delete-expense', id),

  getEmployees: () => ipcRenderer.invoke('db:get-employees'),
  addEmployee: (data) => ipcRenderer.invoke('db:add-employee', data),
  deleteEmployee: (id) => ipcRenderer.invoke('db:delete-employee', id)
});
