import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, ShieldAlert, Database, Server, UploadCloud, Store } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { success, error, info } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'Velora Paint Factory',
    address: 'Paint Factory Rd, Industrial Zone',
    phone: '+94 77 123 4567',
    email: 'info@velorapaints.com',
    footerText: 'Thank you for choosing Velora Paints!',
    taxRate: '0'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await window.api.getSettings();
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await window.api.updateSettings(settings);
      success('Store settings updated successfully!');
    } catch {
      error('Failed to update settings');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleBackup = async () => {
    try {
      info('Starting backup...');
      const res = await window.api.backupDatabase();
      if (res.success) {
        success(`Backup saved to: ${res.path}`);
      } else {
        info('Backup cancelled');
      }
    } catch {
      error('Backup failed');
    }
  };

  const handleRestore = async () => {
    try {
      if (!confirm("WARNING: This will overwrite your current database. Continue?")) return;

      info('Restoring database...');
      const res = await window.api.restoreDatabase();

      if (res.success) {
        success('Database restored successfully! System reloading...');
      } else {
        info('Restore cancelled');
      }
    } catch (e) {
      console.error(e);
      error('Restore failed: ' + e.message);
    }
  };

  const handleFactoryReset = async () => {
    if (confirm("DANGER: This will PERMANENTLY WIPE ALL DATA. Are you absolutely sure?")) {
      try {
        setIsResetting(true);
        const res = await window.api.factoryReset();
        if (res.success) {
          success("Factory Reset Complete. System cleaned.");
          setTimeout(() => window.location.reload(), 2000);
        }
      } catch (err) {
        error("Reset Failed: " + err.message);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="h-full p-10 max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto custom-scrollbar">

      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-4xl font-bold text-white">System Settings</h1>
        <p className="text-zinc-400 mt-2">Manage store information, database, and system preferences.</p>
      </div>

      {/* Store Info Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-cyan-500/30 transition-all shadow-lg shadow-black/20">
        <div className="flex items-center gap-3 mb-6 text-cyan-400">
          <Store size={24} />
          <h2 className="text-xl font-bold">Store Information</h2>
        </div>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Store Name</label>
              <input
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Tax Rate (%)</label>
              <input
                name="taxRate"
                type="number"
                step="0.01"
                min="0"
                value={settings.taxRate}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase">Phone</label>
              <input
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Address</label>
              <input
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
              <input
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Receipt Footer Text</label>
              <input
                name="footerText"
                value={settings.footerText}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all">
              <Save size={18} /> Save Settings
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Backup Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-cyan-500/30 transition-all flex flex-col shadow-lg shadow-black/20">
          <div className="flex items-center gap-3 mb-4 text-cyan-400">
            <Database size={24} />
            <h2 className="text-xl font-bold">Data Management</h2>
          </div>
          <p className="text-zinc-400 mb-6 text-sm leading-relaxed flex-1">
            Create a secure snapshot of your entire database or restore from a previous backup file.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBackup}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-cyan-600 hover:text-black text-white px-5 py-3 rounded-lg transition-all w-full justify-center font-semibold border border-zinc-700 hover:border-cyan-500"
            >
              <Save size={18} />
              Backup Database
            </button>
            <button
              onClick={handleRestore}
              className="flex items-center gap-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white px-5 py-3 rounded-lg transition-all w-full justify-center font-semibold"
            >
              <UploadCloud size={18} />
              Restore from Backup
            </button>
          </div>
        </div>

        {/* Reset Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 hover:border-red-500/30 transition-all relative overflow-hidden flex flex-col shadow-lg shadow-black/20">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ShieldAlert size={100} className="text-red-500" />
          </div>
          <div className="flex items-center gap-3 mb-4 text-red-500">
            <ShieldAlert size={24} />
            <h2 className="text-xl font-bold">Danger Zone</h2>
          </div>
          <p className="text-zinc-400 mb-6 text-sm leading-relaxed flex-1">
            Perform a factory reset to clear all transactions, customers, and inventory data.
            This action <span className="text-red-500 font-bold">cannot be undone</span>.
          </p>

          {!isResetting ? (
            <button
              onClick={() => setIsResetting(true)}
              className="flex items-center gap-2 border border-red-900/50 text-red-500 hover:bg-red-950/30 px-5 py-3 rounded-lg transition-all w-full justify-center font-semibold"
            >
              <RefreshCw size={18} />
              Factory Reset
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleFactoryReset}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-bold animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              >
                CONFIRM WIPE
              </button>
              <button
                onClick={() => setIsResetting(false)}
                className="px-4 py-3 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-10 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-500">
          Velora System v2.1 • Registered to Admin
        </div>
      </div>

    </div>
  );
}