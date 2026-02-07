
/**
 * API Service for interacting with Electron Main process
 * Abstracts window.api calls with JSDoc types
 */

const api = window.api || {
    // Mock for development in browser without electron
    getProducts: async () => [],
    getCustomers: async () => [],
    createTransaction: async () => { },
    getSettings: async () => ({}),
    holdCart: async () => { },
    getHeldCarts: async () => [],
    deleteHeldCart: async () => { },
    getDashboardStats: async () => ({}),
    getRecentActivity: async () => [],
    getTransactions: async () => [],
    getSalesByCategory: async () => [],
    getSmartInsights: async () => null,
    getFormulas: async () => [],
    addProduct: async () => { },
    updateProduct: async () => { },
    deleteProduct: async () => { },
    importProductsFromCSV: async () => { },
    getChemicals: async () => [],
    createFormula: async () => { },
    deleteFormula: async () => { },
    getProductionOrders: async () => [],
    createProductionOrder: async () => { },
    completeProductionOrder: async () => { },
    getAutoProductionPlan: async () => [],
    getExpenses: async () => [],
    addExpense: async () => { },
    deleteExpense: async () => { },
    getEmployees: async () => [],
    addEmployee: async () => { },
    deleteEmployee: async () => { },
    // User Management
    getUsers: async () => [],
    addUser: async () => { },
    updateUser: async () => { },
    deleteUser: async () => { },
    // Customer Management
    addCustomer: async () => { },
    deleteCustomer: async () => { },
    // Settings
    updateSettings: async () => { },
    // Supplier Management
    getSuppliers: async () => [],
    addSupplier: async () => { },
    updateSupplier: async () => { },
    deleteSupplier: async () => { },
    // Chemical Management
    addChemical: async () => { },
    updateChemical: async () => { },
    deleteChemical: async () => { },
    getBatches: async () => [],
    // Purchase Orders
    getPurchaseOrders: async () => [],
    createPurchaseOrder: async () => { },
    getPurchaseOrderItems: async () => [],
    receivePurchaseOrder: async () => { },
    // System
    backupDatabase: async () => { },
    factoryReset: async () => { },
    restoreDatabase: async () => { },
    updateTransaction: async () => { },
    getCustomerHistory: async () => [],
    getSalesByHour: async () => [],
    getTopProducts: async () => [],
};

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price_sell
 * @property {number} stock
 * @property {string} [image]
 * @property {string} category
 * @property {string} [sku]
 */

/**
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} name
 * @property {number} points
 * @property {number} [credit_limit]
 */

/**
 * Fetch all products
 * @returns {Promise<Product[]>}
 */
export const getProducts = async () => {
    try {
        return await api.getProducts();
    } catch (err) {
        console.error("Failed to fetch products:", err);
        throw err;
    }
};

/**
 * Fetch all customers
 * @returns {Promise<Customer[]>}
 */
export const getCustomers = async () => {
    try {
        return await api.getCustomers();
    } catch (err) {
        console.error("Failed to fetch customers:", err);
        throw err;
    }
};

/**
 * Create a new transaction
 * @param {Object} transactionData 
 * @returns {Promise<void>}
 */
export const createTransaction = async (transactionData) => {
    try {
        return await api.createTransaction(transactionData);
    } catch (err) {
        console.error("Transaction failed:", err);
        throw err;
    }
};

/**
 * Get application settings
 * @returns {Promise<Object>}
 */
export const getSettings = async () => {
    try {
        return await api.getSettings();
    } catch (err) {
        console.error("Failed to fetch settings:", err);
        return {};
    }
};

/**
 * Hold current cart
 * @param {Object} data - { customer: string, items: Array }
 */
export const holdCart = async (data) => {
    return await api.holdCart(data);
};

/**
 * Get all held carts
 */
export const getHeldCarts = async () => {
    return await api.getHeldCarts();
};

/**
 * Delete a held cart by ID
 * @param {string} id 
 */
export const deleteHeldCart = async (id) => {
    return await api.deleteHeldCart(id);
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>}
 */
export const getDashboardStats = async () => {
    return await api.getDashboardStats();
};

/**
 * Get recent activity feed
 * @returns {Promise<Array>}
 */
export const getRecentActivity = async () => {
    return await api.getRecentActivity();
};

/**
 * Get all transactions (for history/charts)
 * @returns {Promise<Array>}
 */
export const getTransactions = async () => {
    return await api.getTransactions();
};

/**
 * Get sales broken down by category
 * @returns {Promise<Array>}
 */
export const getSalesByCategory = async () => {
    return await api.getSalesByCategory();
};

/**
 * Get AI Smart Insights
 * @returns {Promise<Object|null>}
 */
export const getSmartInsights = async () => {
    return await api.getSmartInsights();
};

/**
 * Get all formulas
 * @returns {Promise<Array>}
 */
export const getFormulas = async () => {
    return await api.getFormulas();
};

/**
 * Add a new product
 * @param {Object} product 
 */
export const addProduct = async (product) => {
    return await api.addProduct(product);
};

/**
 * Update an existing product
 * @param {Object} product 
 */
export const updateProduct = async (product) => {
    return await api.updateProduct(product);
};

/**
 * Delete a product
 * @param {string} id 
 */
export const deleteProduct = async (id) => {
    return await api.deleteProduct(id);
};

/**
 * Trigger CSV import for products
 */
export const importProductsFromCSV = async () => {
    return await api.importProductsFromCSV();
};

/**
 * Get all chemicals
 * @returns {Promise<Array>}
 */
export const getChemicals = async () => {
    return await api.getChemicals();
};

/**
 * Create a new formula
 * @param {Object} formula 
 */
export const createFormula = async (formula) => {
    return await api.createFormula(formula);
};

/**
 * Delete a formula
 * @param {string} id 
 */
export const deleteFormula = async (id) => {
    return await api.deleteFormula(id);
};

/**
 * Get all production orders
 * @returns {Promise<Array>}
 */
export const getProductionOrders = async () => {
    return await api.getProductionOrders();
};

/**
 * Create a production order
 * @param {Object} order 
 */
export const createProductionOrder = async (order) => {
    return await api.createProductionOrder(order);
};

/**
 * Complete a production order
 * @param {string} id 
 */
export const completeProductionOrder = async (id) => {
    return await api.completeProductionOrder(id);
};

/**
 * Get auto-production plan suggestions
 * @returns {Promise<Array>}
 */
export const getAutoProductionPlan = async () => {
    return await api.getAutoProductionPlan();
};

/**
 * Get all expenses
 * @returns {Promise<Array>}
 */
export const getExpenses = async () => {
    return await api.getExpenses();
};

/**
 * Add a new expense
 * @param {Object} expense 
 */
export const addExpense = async (expense) => {
    return await api.addExpense(expense);
};

/**
 * Delete an expense
 * @param {string} id 
 */
export const deleteExpense = async (id) => {
    return await api.deleteExpense(id);
};

/**
 * Get all employees
 * @returns {Promise<Array>}
 */
export const getEmployees = async () => {
    return await api.getEmployees();
};

/**
 * Add a new employee
 * @param {Object} employee 
 */
export const addEmployee = async (employee) => {
    return await api.addEmployee(employee);
};

/**
 * Delete an employee
 * @param {string} id 
 */
export const deleteEmployee = async (id) => {
    return await api.deleteEmployee(id);
};

/**
 * Get all users
 * @returns {Promise<Array>}
 */
export const getUsers = async () => {
    return await api.getUsers();
};

/**
 * Add a new user
 * @param {Object} user 
 */
export const addUser = async (user) => {
    return await api.addUser(user);
};

/**
 * Update an existing user
 * @param {Object} user 
 */
export const updateUser = async (user) => {
    return await api.updateUser(user);
};

/**
 * Delete a user
 * @param {string} id 
 */
export const deleteUser = async (id) => {
    return await api.deleteUser(id);
};

// --- Customer Management ---

/**
 * Add a new customer
 * @param {Object} data
 */
export const addCustomer = async (data) => {
    return await api.addCustomer(data);
};

/**
 * Delete a customer
 * @param {string} id
 */
export const deleteCustomer = async (id) => {
    return await api.deleteCustomer(id);
};

// --- Settings Management ---

/**
 * Update application settings
 * @param {Object} settings
 */
export const updateSettings = async (settings) => {
    return await api.updateSettings(settings);
};

// --- Supplier Management ---

/**
 * Get all suppliers
 * @returns {Promise<Array>}
 */
export const getSuppliers = async () => {
    return await api.getSuppliers();
};

/**
 * Add a new supplier
 * @param {Object} data
 */
export const addSupplier = async (data) => {
    return await api.addSupplier(data);
};

/**
 * Update an existing supplier
 * @param {Object} data
 */
export const updateSupplier = async (data) => {
    return await api.updateSupplier(data);
};

/**
 * Delete a supplier
 * @param {string} id
 */
export const deleteSupplier = async (id) => {
    return await api.deleteSupplier(id);
};

// --- Chemical Management ---

/**
 * Add a new chemical
 * @param {Object} data
 */
export const addChemical = async (data) => {
    return await api.addChemical(data);
};

/**
 * Update an existing chemical
 * @param {Object} data
 */
export const updateChemical = async (data) => {
    return await api.updateChemical(data);
};

/**
 * Delete a chemical
 * @param {string} id
 */
export const deleteChemical = async (id) => {
    return await api.deleteChemical(id);
};

/**
 * Get batches for a chemical
 * @param {string} chemId
 * @returns {Promise<Array>}
 */
export const getBatches = async (chemId) => {
    return await api.getBatches(chemId);
};

// --- Purchase Order Management ---

/**
 * Get all purchase orders
 * @returns {Promise<Array>}
 */
export const getPurchaseOrders = async () => {
    return await api.getPurchaseOrders();
};

/**
 * Create a new purchase order
 * @param {Object} data
 */
export const createPurchaseOrder = async (data) => {
    return await api.createPurchaseOrder(data);
};

/**
 * Get items for a purchase order
 * @param {string} id
 * @returns {Promise<Array>}
 */
export const getPurchaseOrderItems = async (id) => {
    return await api.getPurchaseOrderItems(id);
};

/**
 * Receive a purchase order
 * @param {string} id
 * @param {Array} items
 */
export const receivePurchaseOrder = async (id, items) => {
    return await api.receivePurchaseOrder(id, items);
};

// --- System Functions ---

/**
 * Backup the database
 */
export const backupDatabase = async () => {
    return await api.backupDatabase();
};

/**
 * Factory reset the database
 */
export const factoryReset = async () => {
    return await api.factoryReset();
};

/**
 * Restore database from backup
 */
export const restoreDatabase = async () => {
    return await api.restoreDatabase();
};

/**
 * Update a transaction
 * @param {Object} data
 */
export const updateTransaction = async (data) => {
    return await api.updateTransaction(data);
};

/**
 * Get customer purchase history
 * @param {string} id
 * @returns {Promise<Array>}
 */
export const getCustomerHistory = async (id) => {
    return await api.getCustomerHistory(id);
};

/**
 * Get sales data by hour
 * @returns {Promise<Array>}
 */
export const getSalesByHour = async () => {
    return await api.getSalesByHour();
};

/**
 * Get top selling products
 * @returns {Promise<Array>}
 */
export const getTopProducts = async () => {
    return await api.getTopProducts();
};