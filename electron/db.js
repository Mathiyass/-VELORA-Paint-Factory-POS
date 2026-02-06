import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userDataPath = app ? app.getPath('userData') : __dirname;
const dbPath = path.join(userDataPath, 'velora_factory.db'); // Rebranded DB name

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON'); // Enforce integrity

function hashPassword(password, salt) {
  if (!salt) salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

// --- Initialization & Schema Migration ---
export function initDb() {
  console.log("Initializing VELORA Paint Factory Database...");
  // 1. Core Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT DEFAULT 'staff', -- admin, manager, staff
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      timestamp TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS backup_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT,
      type TEXT DEFAULT 'Manual', -- Manual, Auto
      status TEXT DEFAULT 'Success',
      timestamp TEXT DEFAULT (datetime('now'))
    );

    -- 2. CRM (Customers)
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      type TEXT DEFAULT 'Retail', -- Retail, Distributor, Corporate
      credit_limit REAL DEFAULT 0,
      points INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- 3. Inventory (Inbound - Suppliers & Raw Materials)
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      rating REAL DEFAULT 5.0 -- Quality Score
    );

    CREATE TABLE IF NOT EXISTS chemicals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      unit TEXT DEFAULT 'kg', -- kg, liter, gram
      reorder_level REAL DEFAULT 10,
      current_stock REAL DEFAULT 0, -- Cached aggregate
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS chemical_batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chemical_id INTEGER NOT NULL,
      supplier_id INTEGER,
      batch_number TEXT NOT NULL, -- Supplier's Batch #
      internal_lot_number TEXT UNIQUE, -- Generated Internal Lot # (Traceability key)
      quantity_initial REAL NOT NULL,
      quantity_remaining REAL NOT NULL,
      cost_per_unit REAL NOT NULL,
      received_date TEXT DEFAULT (datetime('now')),
      expiry_date TEXT,
      status TEXT DEFAULT 'Active', -- Active, Depleted, Expired, Quarantine
      FOREIGN KEY(chemical_id) REFERENCES chemicals(id),
      FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
    );

    CREATE TABLE IF NOT EXISTS purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER NOT NULL,
      status TEXT DEFAULT 'Pending', -- Pending, Received, Cancelled
      created_at TEXT DEFAULT (datetime('now')),
      received_at TEXT,
      total_cost REAL DEFAULT 0,
      notes TEXT,
      FOREIGN KEY(supplier_id) REFERENCES suppliers(id)
    );

    CREATE TABLE IF NOT EXISTS purchase_order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      po_id INTEGER NOT NULL,
      chemical_id INTEGER NOT NULL,
      quantity_ordered REAL NOT NULL,
      cost_quoted REAL NOT NULL,
      FOREIGN KEY(po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
      FOREIGN KEY(chemical_id) REFERENCES chemicals(id)
    );

    -- 4. Manufacturing (Production & Traceability)
    CREATE TABLE IF NOT EXISTS formulas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE, -- Recipe Code
      description TEXT,
      standard_yield REAL DEFAULT 1, -- Base unit (e.g., 1L)
      base_unit TEXT DEFAULT 'L'
    );

    CREATE TABLE IF NOT EXISTS formula_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      formula_id INTEGER NOT NULL,
      chemical_id INTEGER NOT NULL,
      quantity_required REAL NOT NULL, -- Amount needed for standard_yield
      FOREIGN KEY(formula_id) REFERENCES formulas(id) ON DELETE CASCADE,
      FOREIGN KEY(chemical_id) REFERENCES chemicals(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      category TEXT,
      price_sell REAL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      formula_id INTEGER, -- Link to recipe
      image TEXT,
      description TEXT,
      price_buy REAL DEFAULT 0, -- Cost Price
      warranty TEXT,
      FOREIGN KEY(formula_id) REFERENCES formulas(id)
    );
    

    CREATE TABLE IF NOT EXISTS production_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      formula_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      batch_code TEXT UNIQUE, -- Finished Good Batch Code
      quantity_planned REAL NOT NULL,
      quantity_produced REAL DEFAULT 0,
      wastage_cost REAL DEFAULT 0,
      status TEXT DEFAULT 'Planned', -- Planned, In Progress, Completed, Cancelled
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT,
      user_id INTEGER, -- Who managed this
      FOREIGN KEY(formula_id) REFERENCES formulas(id),
      FOREIGN KEY(product_id) REFERENCES products(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS production_consumptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      production_order_id INTEGER NOT NULL,
      chemical_batch_id INTEGER NOT NULL,
      quantity_used REAL NOT NULL,
      cost_at_time REAL NOT NULL, -- Snapshot of cost
      timestamp TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(production_order_id) REFERENCES production_orders(id),
      FOREIGN KEY(chemical_batch_id) REFERENCES chemical_batches(id)
    );

    -- 5. Outbound (Sales & POS)
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no TEXT UNIQUE,
      timestamp TEXT DEFAULT (datetime('now')),
      customer_id INTEGER,
      customer_name TEXT, -- Fallback
      total_amount REAL,
      tax_amount REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      net_profit REAL DEFAULT 0,
      payment_method TEXT, -- JSON for Split Payments: [{"method": "Cash", "amount": 50}, ...]
      status TEXT DEFAULT 'Completed', -- Completed, Voided, Refunded
      user_id INTEGER,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS transaction_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price_unit REAL NOT NULL,
      cost_unit REAL NOT NULL, -- COGS snapshot
      total REAL NOT NULL,
      FOREIGN KEY(transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS held_carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      items_json TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );

    -- 6. Finance
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT, -- Rent, Salary, Power, Maintenance
      date TEXT DEFAULT (datetime('now')),
      description TEXT,
      user_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT, 
      salary REAL,
      phone TEXT,
      email TEXT,
      joined_date TEXT
    );
  `);

  // --- Migrations & Alternations (Safe) ---
  try { db.prepare("ALTER TABLE products ADD COLUMN price_buy REAL DEFAULT 0").run(); } catch { /* ignore */ }
  try { db.prepare("ALTER TABLE products ADD COLUMN warranty TEXT").run(); } catch { /* ignore */ }
  try { db.prepare("ALTER TABLE formulas ADD COLUMN product_id INTEGER").run(); } catch { /* ignore */ }


  // Default Admin
  const adminExists = db.prepare('SELECT count(*) as count FROM users').get();
  if (adminExists.count === 0) {
    const { hash, salt } = hashPassword('admin123');
    db.prepare('INSERT INTO users (name, username, password, salt, role) VALUES (?, ?, ?, ?, ?)')
      .run('Administrator', 'admin', hash, salt, 'admin');
    console.log("Default Admin User Created (admin / admin123)");
  }
}

// --- Auth ---
export function loginUser(username, password) {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) throw new Error('User not found');
  const { hash } = hashPassword(password, user.salt);
  if (hash !== user.password) throw new Error('Invalid password');

  // Log login
  db.prepare('INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)')
    .run(user.id, 'LOGIN', 'User logged in');

  return { id: user.id, name: user.name, username: user.username, role: user.role };
}

export function getUsers() { return db.prepare('SELECT id, name, username, role, created_at FROM users').all(); }
export function addUser(u) {
  const { hash, salt } = hashPassword(u.password);
  return db.prepare('INSERT INTO users (name, username, password, salt, role) VALUES (?, ?, ?, ?, ?)')
    .run(u.name, u.username, hash, salt, u.role || 'staff');
}
export function updateUser(u) {
  if (u.password) {
    const { hash, salt } = hashPassword(u.password);
    return db.prepare('UPDATE users SET name=?, username=?, role=?, password=?, salt=? WHERE id=?')
      .run(u.name, u.username, u.role, hash, salt, u.id);
  }
  return db.prepare('UPDATE users SET name=?, username=?, role=? WHERE id=?').run(u.name, u.username, u.role, u.id);
}
export function deleteUser(id) { return db.prepare('DELETE FROM users WHERE id = ?').run(id); }



// --- CRM (Customers) ---
export function getCustomers() { return db.prepare('SELECT * FROM customers ORDER BY name ASC').all(); }
export function addCustomer(c) {
  return db.prepare('INSERT INTO customers (name, phone, email, credit_limit) VALUES (?, ?, ?, ?)').run(c.name, c.phone, c.email, c.credit_limit || 0);
}
export function deleteCustomer(id) { return db.prepare('DELETE FROM customers WHERE id = ?').run(id); }

export function getCustomerHistory(id) {
  const txs = db.prepare('SELECT * FROM transactions WHERE customer_id = ? ORDER BY timestamp DESC').all(id);
  return txs.map(t => {
    const items = db.prepare('SELECT ti.*, p.name FROM transaction_items ti JOIN products p ON ti.product_id = p.id WHERE transaction_id = ?').all(t.id);
    return { ...t, items };
  });
}

// --- Factory Inbound (Suppliers & Chemicals) ---
export function getSuppliers() { return db.prepare('SELECT * FROM suppliers ORDER BY name ASC').all(); }
export function addSupplier(s) { return db.prepare('INSERT INTO suppliers (name, contact_person, email, address, phone) VALUES (?, ?, ?, ?, ?)').run(s.name, s.contact, s.email, s.address, s.phone); }
export function deleteSupplier(id) { return db.prepare('DELETE FROM suppliers WHERE id=?').run(id); }

export function getChemicals() {
  return db.prepare(`
    SELECT c.*,
    (SELECT IFNULL(SUM(b.quantity_remaining * b.cost_per_unit) / NULLIF(SUM(b.quantity_remaining), 0), 0)
     FROM chemical_batches b WHERE b.chemical_id = c.id AND b.quantity_remaining > 0) as avg_cost
    FROM chemicals c
    ORDER BY c.name ASC
  `).all();
}
export function addChemical(c) { return db.prepare('INSERT INTO chemicals (name, sku, unit, reorder_level, current_stock) VALUES (?, ?, ?, ?, 0)').run(c.name, c.sku, c.unit, c.reorder_level); }

// --- Advanced Inventory (Batches) ---
export function getBatches(chemicalId) {
  if (chemicalId) return db.prepare('SELECT * FROM chemical_batches WHERE chemical_id = ? ORDER BY quantity_remaining DESC').all(chemicalId);
  return db.prepare(`
        SELECT b.*, c.name as chemical_name, s.name as supplier_name 
        FROM chemical_batches b
        LEFT JOIN chemicals c ON b.chemical_id = c.id
        LEFT JOIN suppliers s ON b.supplier_id = s.id
        ORDER BY b.received_date DESC
    `).all();
}

// --- Purchase Orders ---
export function getPurchaseOrders() {
  return db.prepare(`
    SELECT po.*, s.name as supplier_name 
    FROM purchase_orders po
    LEFT JOIN suppliers s ON po.supplier_id = s.id
    ORDER BY po.created_at DESC
  `).all();
}

export function createPurchaseOrder(data) {
  return db.transaction(() => {
    const total = data.items.reduce((sum, i) => sum + (i.quantity * i.cost), 0);
    const res = db.prepare('INSERT INTO purchase_orders (supplier_id, total_cost) VALUES (?, ?)').run(data.supplier_id, total);
    const poId = res.lastInsertRowid;
    const insertItem = db.prepare('INSERT INTO purchase_order_items (po_id, chemical_id, quantity_ordered, cost_quoted) VALUES (?, ?, ?, ?)');

    for (const item of data.items) {
      insertItem.run(poId, item.chemical_id, item.quantity, item.cost);
    }
    return poId;
  })();
}

export function getPurchaseOrderItems(poId) {
  return db.prepare('SELECT * FROM purchase_order_items WHERE po_id = ?').all(poId);
}

// Transactional Receive PO -> Create Batches
export function receivePurchaseOrder(poId, itemsToReceive) {
  // itemsToReceive: [{ chemical_id, quantity, batch_number, expiry_date, cost }]
  const tx = db.transaction(() => {
    db.prepare('UPDATE purchase_orders SET status = ?, received_at = datetime("now") WHERE id = ?').run('Received', poId);

    const insertBatch = db.prepare(`
            INSERT INTO chemical_batches 
            (chemical_id, supplier_id, batch_number, internal_lot_number, quantity_initial, quantity_remaining, cost_per_unit, expiry_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

    const updateStock = db.prepare('UPDATE chemicals SET current_stock = current_stock + ? WHERE id = ?');
    const getSupplier = db.prepare('SELECT supplier_id FROM purchase_orders WHERE id = ?').get(poId);

    for (const item of itemsToReceive) {
      const lot = `LOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      insertBatch.run(item.chemical_id, getSupplier.supplier_id, item.batch_number, lot, item.quantity, item.quantity, item.cost, item.expiry_date);
      updateStock.run(item.quantity, item.chemical_id);
    }
  });
  return tx();
}


// --- Production & Manufacturing ---

// --- Production & Manufacturing ---
// (Functions defined below in Production Section)



// --- Products & Sales ---
export function getProducts() { return db.prepare('SELECT * FROM products ORDER BY name ASC').all(); }
export function addProduct(p) {
  const stmt = db.prepare(`
    INSERT INTO products (name, sku, category, price_sell, price_buy, stock, formula_id, image, warranty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(p.name, p.sku, p.category, p.price_sell, p.price_buy || 0, p.stock || 0, p.formula_id, p.image, p.warranty);
}

export function updateProduct(p) {
  const stmt = db.prepare(`
    UPDATE products SET 
      name = ?, sku = ?, category = ?, price_sell = ?, price_buy = ?, stock = ?, formula_id = ?, image = ?, warranty = ?
    WHERE id = ?
  `);
  return stmt.run(p.name, p.sku, p.category, p.price_sell, p.price_buy || 0, p.stock || 0, p.formula_id, p.image, p.warranty, p.id);
}

export function processSale(data) {
  // data: { items: [], customer_id, payment_method (json), total, user_id }
  return db.transaction(() => {
    const inv = `INV-${Date.now()}`;

    // Calculate Total COGS for this transaction
    let totalCOGS = 0;
    const itemsWithCost = data.items.map(item => {
      // Fetch latest cost (WAC) from product if not provided
      const product = db.prepare('SELECT price_buy FROM products WHERE id = ?').get(item.id);
      const unitCost = product ? product.price_buy : 0;
      totalCOGS += (unitCost * item.quantity);
      return { ...item, cost: unitCost };
    });

    const netProfit = data.total - totalCOGS;

    const res = db.prepare('INSERT INTO transactions (invoice_no, customer_id, total_amount, net_profit, payment_method, user_id) VALUES (?,?,?,?,?,?)')
      .run(inv, data.customer_id, data.total, netProfit, JSON.stringify(data.payment_method), data.user_id);
    const txId = res.lastInsertRowid;

    for (const item of itemsWithCost) {
      // Deduct Stock
      db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.id);

      // Record Line Item with Snapshot of Cost
      db.prepare('INSERT INTO transaction_items (transaction_id, product_id, quantity, price_unit, cost_unit, total) VALUES (?,?,?,?,?,?)')
        .run(txId, item.id, item.quantity, item.price, item.cost, (item.price * item.quantity));
    }
    return { success: true, invoice: inv };
  })();
}

// --- Finance (Expenses) ---
export function getExpenses() {
  return db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
}

export function addExpense(expense) {
  const { title, amount, category, description, date } = expense;
  return db.prepare('INSERT INTO expenses (title, amount, category, description, date) VALUES (?, ?, ?, ?, ?)').run(title, amount, category, description, date || new Date().toISOString());
}

export function deleteExpense(id) {
  return db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
}

// --- Finance (Employees) ---
export function getEmployees() {
  return db.prepare('SELECT * FROM employees ORDER BY name ASC').all();
}

export function addEmployee(emp) {
  const { name, role, salary, phone, email, joined_date } = emp;
  return db.prepare('INSERT INTO employees (name, role, salary, phone, email, joined_date) VALUES (?, ?, ?, ?, ?, ?)').run(name, role, salary, phone, email, joined_date);
}

export function deleteEmployee(id) {
  return db.prepare('DELETE FROM employees WHERE id = ?').run(id);
}

// --- Production (Formulas) ---
export function getFormulas() {
  const formulas = db.prepare(`
    SELECT f.*, p.name as product_name
    FROM formulas f
    LEFT JOIN products p ON f.product_id = p.id
    ORDER BY f.name ASC
  `).all();

  return formulas.map(f => {
    const ingredients = db.prepare(`
      SELECT fi.*, c.name as chemical_name, c.unit
      FROM formula_ingredients fi
      LEFT JOIN chemicals c ON fi.chemical_id = c.id
      WHERE fi.formula_id = ?
    `).all(f.id);
    return { ...f, ingredients };
  });
}

export function createFormula(data) {
  const { name, description, product_id, yield_quantity, ingredients } = data;

  return db.transaction(() => {
    const res = db.prepare('INSERT INTO formulas (name, description, product_id, standard_yield) VALUES (?, ?, ?, ?)').run(name, description, product_id, yield_quantity || 1);
    const formula_id = res.lastInsertRowid;

    const insertIng = db.prepare('INSERT INTO formula_ingredients (formula_id, chemical_id, quantity_required) VALUES (?, ?, ?)');
    for (const ing of ingredients) {
      insertIng.run(formula_id, ing.chemical_id, ing.quantity_required);
    }

    // Link product to this formula if selected
    if (product_id) {
      db.prepare('UPDATE products SET formula_id = ? WHERE id = ?').run(formula_id, product_id);
    }
    return { id: formula_id };
  })();
}

export function deleteFormula(id) {
  return db.transaction(() => {
    db.prepare('DELETE FROM formula_ingredients WHERE formula_id = ?').run(id);
    db.prepare('DELETE FROM formulas WHERE id = ?').run(id);
  })();
}

// --- Production (Orders & FIFO) ---
export function getProductionOrders() {
  return db.prepare(`
    SELECT po.*, f.name as formula_name, p.name as product_name
    FROM production_orders po
    LEFT JOIN formulas f ON po.formula_id = f.id
    LEFT JOIN products p ON po.product_id = p.id
    ORDER BY po.created_at DESC
  `).all();
}

export function createProductionOrder(data) {
  const { formula_id, quantity_planned } = data;
  // Get product_id from formula
  const formula = db.prepare('SELECT product_id FROM formulas WHERE id = ?').get(formula_id);

  const created_at = new Date().toISOString();
  return db.prepare(`
    INSERT INTO production_orders (formula_id, product_id, quantity_planned, status, created_at)
    VALUES (?, ?, ?, 'Planned', ?)
  `).run(formula_id, formula?.product_id, quantity_planned, created_at);
}

export function completeProductionOrder(orderId) {
  return db.transaction(() => {
    const order = db.prepare('SELECT * FROM production_orders WHERE id = ?').get(orderId);
    if (!order || order.status !== 'Planned') throw new Error('Order not found or already completed');

    const ingredients = db.prepare('SELECT * FROM formula_ingredients WHERE formula_id = ?').all(order.formula_id);

    // Check and Deduct Chemicals (FIFO)
    const updateBatch = db.prepare('UPDATE chemical_batches SET quantity_remaining = ? WHERE id = ?');
    const updateChem = db.prepare('UPDATE chemicals SET current_stock = current_stock - ? WHERE id = ?');

    let totalBatchCost = 0; // Total cost of materials used

    for (const ing of ingredients) {
      let required = ing.quantity_required * order.quantity_planned;
      const batches = db.prepare(`
        SELECT * FROM chemical_batches 
        WHERE chemical_id = ? AND quantity_remaining > 0 
        ORDER BY received_date ASC
      `).all(ing.chemical_id);

      let totalAvailable = 0;
      batches.forEach(b => totalAvailable += b.quantity_remaining);

      if (totalAvailable < required) {
        throw new Error(`Insufficient stock for chemical ID ${ing.chemical_id}. Required: ${required}, Available: ${totalAvailable}`);
      }

      for (const batch of batches) {
        if (required <= 0) break;
        const take = Math.min(required, batch.quantity_remaining);

        updateBatch.run(batch.quantity_remaining - take, batch.id);
        updateChem.run(take, ing.chemical_id);

        // Accumulate Cost
        totalBatchCost += (take * batch.cost_per_unit);

        required -= take;
      }
    }

    // Add Product Stock & Update Weighted Average Cost (WAC)
    if (order.product_id) {
      const product = db.prepare('SELECT stock, price_buy FROM products WHERE id = ?').get(order.product_id);
      const currentStock = product.stock || 0;
      const currentAvgCost = product.price_buy || 0;
      const newQty = order.quantity_planned;

      // Cost of this new batch per unit
      const unitCostOfBatch = totalBatchCost / newQty;

      // WAC Formula
      let newAvgCost = 0;
      if (currentStock + newQty > 0) {
        newAvgCost = ((currentStock * currentAvgCost) + (newQty * unitCostOfBatch)) / (currentStock + newQty);
      } else {
        newAvgCost = unitCostOfBatch;
      }

      db.prepare('UPDATE products SET stock = stock + ?, price_buy = ? WHERE id = ?')
        .run(newQty, newAvgCost, order.product_id);
    }

    const completed_at = new Date().toISOString();
    db.prepare("UPDATE production_orders SET status = 'Completed', completed_at = ?, wastage_cost = ? WHERE id = ?")
      .run(completed_at, 0, orderId); // wastage calc can be added later
    return { success: true };
  })();
}

// --- Analytics & Dashboard ---
export function getDashboardStats() {
  const today = new Date().toISOString().split('T')[0];

  const revenueObj = db.prepare('SELECT SUM(total_amount) as val FROM transactions WHERE timestamp LIKE ?').get(`${today}%`);
  const profitObj = db.prepare('SELECT SUM(net_profit) as val FROM transactions WHERE timestamp LIKE ?').get(`${today}%`);
  const ordersObj = db.prepare('SELECT COUNT(*) as val FROM transactions WHERE timestamp LIKE ?').get(`${today}%`);

  // Low Stock: Chemicals < Reorder Level OR Products < 5
  const lowChem = db.prepare('SELECT COUNT(*) as val FROM chemicals WHERE current_stock < reorder_level').get();
  const lowProd = db.prepare('SELECT COUNT(*) as val FROM products WHERE stock < 5').get();

  // Production Stats
  const activeProd = db.prepare("SELECT COUNT(*) as val FROM production_orders WHERE status = 'Planned'").get();
  const completedProd = db.prepare("SELECT COUNT(*) as val FROM production_orders WHERE completed_at LIKE ? AND status = 'Completed'").get(`${today}%`);

  return {
    totalRevenue: revenueObj?.val || 0,
    netProfit: profitObj?.val || 0,
    totalSales: ordersObj?.val || 0,
    activeProduction: activeProd?.val || 0,
    completedProductionToday: completedProd?.val || 0,
    lowStockCount: (lowChem?.val || 0) + (lowProd?.val || 0)
  };
}

export function getRecentActivity() {
  // Returns recent transactions
  return db.prepare('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 5').all();
}

export function getTopSellingProducts() {
  try {
    return db.prepare(`
      SELECT p.name, SUM(ti.quantity) as qty, SUM(ti.total) as revenue
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      GROUP BY p.name
      ORDER BY qty DESC
      LIMIT 5
   `).all();
  } catch { /* ignore */ return []; }
}

export function getSalesByCategory() {
  try {
    const rows = db.prepare(`
      SELECT p.category, SUM(ti.total) as value
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      GROUP BY p.category
   `).all();
    return rows.map(r => ({ name: r.category || 'General', value: r.value }));
  } catch { /* ignore */ return []; }
}

export function getSalesByHour() {
  // Aggregate sales by hour of day (00-23) for the last 30 days
  return db.prepare(`
    SELECT strftime('%H', timestamp) as hour, SUM(total_amount) as sales
    FROM transactions
    WHERE timestamp >= date('now', '-30 days')
    GROUP BY hour
    ORDER BY hour ASC
  `).all();
}

// --- Settings ---
export function getSettings() {
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(r => settings[r.key] = r.value);
  return settings;
}

export function updateSettings(settings) {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const updateInfo = db.transaction((data) => {
    for (const [key, value] of Object.entries(data)) {
      stmt.run(key, String(value));
    }
  });
  updateInfo(settings);
  return { success: true };
}

// --- Sales History ---
export function getTransactions() {
  return db.prepare('SELECT * FROM transactions ORDER BY timestamp DESC').all().map(t => {
    const items = db.prepare('SELECT ti.*, p.name FROM transaction_items ti JOIN products p ON ti.product_id = p.id WHERE transaction_id = ?').all(t.id);
    return { ...t, items };
  });
}

// --- System & Maintenance ---
export function factoryReset() {
  // Drop all tables and re-init
  const tables = ['users', 'settings', 'audit_logs', 'customers', 'suppliers', 'chemicals', 'chemical_batches', 'purchase_orders', 'purchase_order_items', 'formulas', 'formula_ingredients', 'products', 'production_orders', 'production_consumptions', 'transactions', 'transaction_items', 'held_carts', 'expenses', 'employees'];
  db.transaction(() => {
    for (const t of tables) {
      db.prepare(`DROP TABLE IF EXISTS ${t}`).run();
    }
  })();
  initDb();
  return { success: true };
}

export function backupDatabase(destDir) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `backup-velora-${timestamp}.db`;
  const destPath = path.join(destDir, backupName);

  return db.backup(destPath)
    .then(() => {
      console.log('Backup successful:', destPath);
      db.prepare('INSERT INTO backup_history (path, type, status) VALUES (?, ?, ?)').run(destPath, 'Manual', 'Success');
      return destPath;
    })
    .catch((err) => {
      console.error('Backup failed:', err);
      db.prepare('INSERT INTO backup_history (path, type, status) VALUES (?, ?, ?)').run(destPath, 'Manual', 'Failed');
      throw err;
    });
}

export async function restoreDatabase(srcPath) {
  // Close current db, copy file, reopen
  try {
    db.close();
    const fs = await import('fs/promises');
    await fs.copyFile(srcPath, dbPath);
    // Re-instantiate DB connection (requires restart in many cases, but we can try to reload object if architected that way. 
    // Since 'db' is a top-level const, we can't easily reassign it without changing architecture.
    // The IPC handler in main.js calls mainWindow.reload() which refreshes the frontend, but the backend DB connection might be stale or closed.
    // A simple approach for Electron apps without hot-reloading DB connection logic is to just tell the user to restart, or use better-sqlite3's backup API in reverse if supported (it supports backup TO a file, not restoring FROM one easily while open).
    // Actually, better-sqlite3 doesn't support restoring from file while open easily. 
    // We will copy the file and then force app relaunch.
    app.relaunch();
    app.exit();
    return { success: true };
  } catch (e) {
    console.error("Restore failed", e);
    return { success: false, error: e.message };
  }
}

// --- Missing Functions Implementation ---

export function deleteProduct(id) {
  return db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

export function updateTransaction(data) {
  // data: { id, newDate, newItems, newCustomer, newTotal }
  // This is complex because it involves stock adjustments.
  // For MVP/Prototype: Update basic fields. 
  // Re-calculating stock for changed items is tricky without full diff.
  // We'll update the record fields for now.
  const { id, newDate, newCustomer, newTotal } = data;
  return db.prepare('UPDATE transactions SET timestamp = ?, customer_name = ?, total_amount = ? WHERE id = ?')
    .run(newDate, newCustomer, newTotal, id);
}

export function addHeldCart(data) {
  // data: { customer, items }
  return db.prepare('INSERT INTO held_carts (customer_name, items_json) VALUES (?, ?)').run(data.customer, JSON.stringify(data.items));
}

export function getHeldCarts() {
  const rows = db.prepare('SELECT * FROM held_carts ORDER BY timestamp DESC').all();
  return rows.map(r => ({
    ...r,
    items: JSON.parse(r.items_json)
  }));
}

export function deleteHeldCart(id) {
  return db.prepare('DELETE FROM held_carts WHERE id = ?').run(id);
}

export function updateSupplier(s) {
  return db.prepare('UPDATE suppliers SET name=?, contact_person=?, email=?, address=?, phone=? WHERE id=?')
    .run(s.name, s.contact, s.email, s.address, s.phone, s.id);
}

export function updateChemical(c) {
  return db.prepare('UPDATE chemicals SET name=?, sku=?, unit=?, reorder_level=? WHERE id=?')
    .run(c.name, c.sku, c.unit, c.reorder_level, c.id);
}

export function deleteChemical(id) {
  return db.prepare('DELETE FROM chemicals WHERE id = ?').run(id);
}

export function importProductsFromCSV(filePath) {
  // Placeholder for CSV import logic
  // const fs = require('fs');
  // const csv = fs.readFileSync(filePath, 'utf-8');
  // Parse and insert...
  return { success: true, message: "Import feature coming soon" };
}

// --- Smart Insights & Automation ---
export function getSmartInsights() {
  const today = new Date().toISOString().split('T')[0];
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const sevenDaysAgo = last7Days.toISOString().split('T')[0];

  // 1. Trending Products (Top 3 by Quantity in last 7 days)
  const trending = db.prepare(`
    SELECT p.name, SUM(ti.quantity) as qty
    FROM transaction_items ti
    JOIN transactions t ON ti.transaction_id = t.id
    JOIN products p ON ti.product_id = p.id
    WHERE t.timestamp >= ?
    GROUP BY p.name
    ORDER BY qty DESC
    LIMIT 3
  `).all(sevenDaysAgo);

  // 2. Low Stock Alerts
  const lowStock = db.prepare(`
    SELECT name, current_stock as stock, reorder_level as threshold, 'Chemical' as type FROM chemicals WHERE current_stock <= reorder_level
    UNION ALL
    SELECT name, stock, 5 as threshold, 'Product' as type FROM products WHERE stock <= 5
  `).all();

  // 3. Sales Spike (Today vs Avg of last 7 days)
  const todaySales = db.prepare("SELECT SUM(total_amount) as total FROM transactions WHERE timestamp LIKE ?").get(`${today}%`)?.total || 0;
  const last7DaysSales = db.prepare("SELECT SUM(total_amount) as total FROM transactions WHERE timestamp >= ? AND timestamp < ?").get(sevenDaysAgo, today)?.total || 0;
  const avgDaily = last7DaysSales / 7;

  return {
    trending,
    lowStock,
    performance: {
      today: todaySales,
      avgDaily: avgDaily || 1, // avoid division by zero
      status: todaySales > avgDaily ? 'Trending Up' : 'Trending Down'
    }
  };
}

export function getAutoProductionPlan() {
  // Find products below safety stock (e.g., 10) that have a linked formula
  const targetStock = 50;
  const threshold = 10;

  const lowProducts = db.prepare(`
    SELECT p.id as product_id, p.name as product_name, p.stock, p.formula_id, f.name as formula_name
    FROM products p
    JOIN formulas f ON p.formula_id = f.id
    WHERE p.stock < ?
  `).all(threshold);

  return lowProducts.map(p => ({
    product_id: p.product_id,
    product_name: p.product_name,
    formula_id: p.formula_id,
    formula_name: p.formula_name,
    current_stock: p.stock,
    quantity_planned: Math.max(targetStock - p.stock, 0)
  }));
}

export { db };