
import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useCustomers = () => {
    const { success, error } = useToast();
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', credit_limit: '' });
    const [loading, setLoading] = useState(false);

    // History Modal State
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerHistory, setCustomerHistory] = useState([]);

    const loadCustomers = useCallback(async () => {
        try {
            const data = await api.getCustomers();
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load customers", err);
            error("Failed to load customers");
        }
    }, [error]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;
        setLoading(true);
        try {
            await api.addCustomer({
                ...formData,
                credit_limit: parseFloat(formData.credit_limit) || 0
            });
            setFormData({ name: '', phone: '', email: '', credit_limit: '' });
            await loadCustomers();
            success("Customer added successfully");
        } catch (err) {
            console.error(err);
            error("Failed to add customer");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this customer? This cannot be undone.")) return;
        try {
            await api.deleteCustomer(id);
            await loadCustomers();
            success("Customer deleted");
        } catch (err) {
            console.error(err);
            error("Failed to delete customer");
        }
    };

    const handleViewHistory = async (customer) => {
        setSelectedCustomer(customer);
        try {
            const history = await api.getCustomerHistory(customer.id);
            setCustomerHistory(history);
            setHistoryModalOpen(true);
        } catch (e) {
            console.error(e);
            error("Failed to load history");
        }
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.phone && c.phone.includes(search))
        );
    }, [customers, search]);

    return {
        customers: filteredCustomers,
        search,
        formData,
        loading,
        historyModalOpen,
        selectedCustomer,
        customerHistory,
        actions: {
            setSearch,
            setFormData,
            handleSubmit,
            handleDelete,
            handleViewHistory,
            setHistoryModalOpen
        }
    };
};
