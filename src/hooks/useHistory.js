
import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useHistory = () => {
    const { success, error } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [selectedTx, setSelectedTx] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Edit Mode State
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState(null);

    // Invoice Display State
    const [invoiceData, setInvoiceData] = useState(null);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.getTransactions();
            setTransactions(res || []);
        } catch (err) {
            console.error(err);
            error("Failed to load history");
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx =>
            (tx.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.id.toString().includes(searchTerm)
        );
    }, [transactions, searchTerm]);

    const openDetails = (tx) => {
        setSelectedTx(tx);
        setEditMode(false);
        setEditData(null);
    };

    const closeDetails = () => {
        setSelectedTx(null);
        setEditMode(false);
        setEditData(null);
    };

    const startEdit = () => {
        setEditMode(true);
        setEditData(JSON.parse(JSON.stringify(selectedTx))); // Deep copy
    };

    const cancelEdit = () => {
        setEditMode(false);
        setEditData(null);
    };

    const updateEditData = (key, value) => {
        setEditData(prev => ({ ...prev, [key]: value }));
    };

    const updateEditItemQuantity = (index, change) => {
        setEditData(prev => {
            const newItems = [...prev.items];
            const newQty = (newItems[index].quantity || 1) + change;
            if (newQty < 1) return prev; // Don't allow 0 or negative

            newItems[index].quantity = newQty;
            const newTotal = newItems.reduce((sum, item) => sum + ((item.price_sell ?? 0) * item.quantity), 0);
            return { ...prev, items: newItems, total: newTotal };
        });
    };

    const removeEditItem = (index) => {
        setEditData(prev => {
            const newItems = [...prev.items];
            newItems.splice(index, 1);
            const newTotal = newItems.reduce((sum, item) => sum + ((item.price_sell ?? 0) * item.quantity), 0);
            return { ...prev, items: newItems, total: newTotal };
        });
    };

    const saveChanges = async () => {
        try {
            await api.updateTransaction({
                id: editData.id,
                newDate: editData.timestamp,
                newItems: editData.items,
                newCustomer: editData.customer_name,
                newTotal: editData.total
            });
            success("Transaction Updated & Stock Restored!");
            setEditMode(false);
            setSelectedTx(null);
            loadHistory();
        } catch (err) {
            console.error(err);
            error("Update Failed: " + err.message);
        }
    };

    // Invoice Actions
    const printInvoice = (tx) => {
        // Format the transaction data for the Invoice component
        setInvoiceData({
            id: tx.id,
            date: tx.timestamp,
            timestamp: tx.timestamp,
            customer: tx.customer_name,
            customer_name: tx.customer_name,
            items: tx.items,
            total: tx.total ?? tx.total_amount,
            tax: tx.tax ?? tx.tax_amount ?? 0,
            discount: tx.discount ?? tx.discount_amount ?? 0,
            paymentMethod: tx.payment_method
        });
    };

    const closeInvoice = () => {
        setInvoiceData(null);
    };

    return {
        transactions: filteredTransactions,
        selectedTx,
        loading,
        searchTerm,
        editMode,
        editData,
        invoiceData,
        actions: {
            setSearchTerm,
            openDetails,
            closeDetails,
            startEdit,
            cancelEdit,
            updateEditData,
            updateEditItemQuantity,
            removeEditItem,
            saveChanges,
            printInvoice,
            closeInvoice,
            reload: loadHistory
        }
    };
};

