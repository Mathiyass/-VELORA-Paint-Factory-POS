
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useSettings = () => {
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

    const loadSettings = useCallback(async () => {
        try {
            const data = await api.getSettings();
            if (data && Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            await api.updateSettings(settings);
            success('Store settings updated successfully!');
        } catch (err) {
            console.error(err);
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
            const res = await api.backupDatabase();
            if (res.success) {
                success(`Backup saved to: ${res.path}`);
            } else {
                info('Backup cancelled');
            }
        } catch (err) {
            console.error(err);
            error('Backup failed');
        }
    };

    const handleRestore = async () => {
        try {
            if (!window.confirm("WARNING: This will overwrite your current database. Continue?")) return;

            info('Restoring database...');
            const res = await api.restoreDatabase();

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
        if (window.confirm("DANGER: This will PERMANENTLY WIPE ALL DATA. Are you absolutely sure?")) {
            try {
                setIsResetting(true);
                const res = await api.factoryReset();
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

    return {
        settings,
        isResetting,
        actions: {
            handleChange,
            handleSaveSettings,
            handleBackup,
            handleRestore,
            handleFactoryReset,
            setIsResetting
        }
    };
};
