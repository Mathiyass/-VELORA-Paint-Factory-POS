/* eslint-env node */
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  // Dev vs Prod URL
  if (process.env.NODE_ENV === 'development') {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1024,
      minHeight: 768,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false
      },
      title: "GamersEdge POS",
      backgroundColor: '#0f172a',
      show: false,
      frame: true
    });
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1024,
      minHeight: 768,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false
      },
      title: "GamersEdge POS",
      backgroundColor: '#0f172a',
      show: false,
      frame: true,
      autoHideMenuBar: true
    });
    mainWindow.once('ready-to-show', () => mainWindow.show());

    // Use loadFile for local production build to avoid file:// protocol path issues on Windows
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load local index.html:', err);
      dialog.showErrorBox('Startup Error', `Could not load application file:\n${indexPath}\n\nError: ${err.message}`);
    });

    // Keep DevTools open in production temporarily to help debug 'black screen' if it persists (likely a JS error in Renderer)
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  try {
    db.initDb();
  } catch (err) {
    console.error("DB Init Failed:", err);
  }
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- Safe IPC Wrapper ---
function handleIpc(channel, handler) {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      return await handler(event, ...args);
    } catch (err) {
      console.error(`IPC Error [${channel}]:`, err);
      // Return error object instead of crashing
      return { error: err.message };
    }
  });
}

// --- Handlers ---

// Dashboard
handleIpc('db:get-dashboard-stats', () => db.getDashboardStats());
handleIpc('db:get-recent-activity', () => db.getRecentActivity());
handleIpc('db:get-top-products', () => db.getTopSellingProducts());
handleIpc('db:get-sales-by-category', () => db.getSalesByCategory());
handleIpc('db:get-sales-by-hour', () => db.getSalesByHour());

// Products
handleIpc('db:get-products', () => db.getProducts());
handleIpc('db:add-product', (_, data) => db.addProduct(data));
handleIpc('db:update-product', (_, data) => db.updateProduct(data));
handleIpc('db:delete-product', (_, id) => db.deleteProduct(id));
handleIpc('db:import-products-csv', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'CSV File', extensions: ['csv'] }],
    title: 'Select Inventory CSV'
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, message: 'Cancelled' };
  }

  return db.importProductsFromCSV(result.filePaths[0]);
});

// Transactions
handleIpc('db:process-sale', (_, data) => db.processSale(data));
handleIpc('db:get-history', () => db.getTransactions());
handleIpc('db:update-transaction', (_, data) => db.updateTransaction(data));
handleIpc('db:get-customer-history', (_, id) => db.getCustomerHistory(id));

// Cart Hold/Recall
handleIpc('db:hold-cart', (_, data) => db.addHeldCart(data));
handleIpc('db:get-held-carts', () => db.getHeldCarts());
handleIpc('db:delete-held-cart', (_, id) => db.deleteHeldCart(id));

// Auth
handleIpc('auth:login', (_, { username, password }) => db.loginUser(username, password));
handleIpc('auth:get-users', () => db.getUsers());
handleIpc('auth:add-user', (_, data) => db.addUser(data));
handleIpc('auth:update-user', (_, data) => db.updateUser(data));
handleIpc('auth:delete-user', (_, id) => db.deleteUser(id));
// Customers
handleIpc('db:get-customers', () => db.getCustomers());
handleIpc('db:add-customer', (_, data) => db.addCustomer(data));
handleIpc('db:delete-customer', (_, id) => db.deleteCustomer(id));

// Settings & System
handleIpc('app:get-settings', () => db.getSettings());
handleIpc('app:update-settings', (_, settings) => db.updateSettings(settings));

handleIpc('app:backup', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Backup Destination'
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, message: 'Cancelled' };
  }

  const destPath = await db.backupDatabase(result.filePaths[0]);
  return { success: true, path: destPath };
});

handleIpc('app:factory-reset', () => db.factoryReset());

handleIpc('app:restore-backup', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite'] }],
    title: 'Select Backup File to Restore'
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, message: 'Cancelled' };
  }

  const success = await db.restoreDatabase(result.filePaths[0]);
  // Reload window to refresh data
  mainWindow.reload();
  return success;
});

// --- Factory Handlers ---
handleIpc('db:get-suppliers', () => db.getSuppliers());
handleIpc('db:add-supplier', (_, d) => db.addSupplier(d));
handleIpc('db:update-supplier', (_, d) => db.updateSupplier(d));
handleIpc('db:delete-supplier', (_, id) => db.deleteSupplier(id));

handleIpc('db:get-chemicals', () => db.getChemicals());
handleIpc('db:add-chemical', (_, d) => db.addChemical(d));
handleIpc('db:update-chemical', (_, d) => db.updateChemical(d));
handleIpc('db:delete-chemical', (_, id) => db.deleteChemical(id));
handleIpc('db:get-batches', (_, id) => db.getBatches(id));

handleIpc('db:get-pos', () => db.getPurchaseOrders());
handleIpc('db:create-po', (_, d) => db.createPurchaseOrder(d));
handleIpc('db:get-po-items', (_, id) => db.getPurchaseOrderItems(id));
handleIpc('db:receive-po', (_, id, items) => db.receivePurchaseOrder(id, items));

// --- Production Handlers ---
handleIpc('db:get-formulas', () => db.getFormulas());
handleIpc('db:create-formula', (_, d) => db.createFormula(d));
handleIpc('db:delete-formula', (_, id) => db.deleteFormula(id));

handleIpc('db:get-production-orders', () => db.getProductionOrders());
handleIpc('db:create-production-order', (_, d) => db.createProductionOrder(d));
handleIpc('db:complete-production-order', (_, id) => db.completeProductionOrder(id));

// --- Finance Handlers ---
handleIpc('db:get-expenses', () => db.getExpenses());
handleIpc('db:add-expense', (_, d) => db.addExpense(d));
handleIpc('db:delete-expense', (_, id) => db.deleteExpense(id));

handleIpc('db:get-employees', () => db.getEmployees());
handleIpc('db:add-employee', (_, d) => db.addEmployee(d));
handleIpc('db:delete-employee', (_, id) => db.deleteEmployee(id));

// --- Smart Insights & Automation Handlers ---
handleIpc('db:get-smart-insights', () => db.getSmartInsights());
handleIpc('db:get-auto-production-plan', () => db.getAutoProductionPlan());
