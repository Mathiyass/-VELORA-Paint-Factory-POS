
import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';
import { playSound } from '../utils/sounds';

export const usePOS = () => {
    const { success, error } = useToast();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [customer, setCustomer] = useState('');
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [heldCarts, setHeldCarts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Load
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prods, settings] = await Promise.all([
                api.getProducts(),
                api.getSettings()
            ]);
            setProducts(prods || []);
            if (settings && settings.taxRate) {
                setTaxRate(parseFloat(settings.taxRate) || 0);
            }
        } catch (err) {
            console.error("Error loading POS data", err);
            error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    // --- Cart Actions ---
    const addToCart = (product) => {
        playSound('beep');
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    playSound('error');
                    error(`Only ${product.stock} in stock!`);
                    return prev;
                }
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const product = products.find(p => p.id === id);
                const newQty = Math.max(1, item.quantity + delta);
                if (product && newQty > product.stock) {
                    playSound('error');
                    error('Insufficient stock!');
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

    const clearCart = () => {
        setCart([]);
        setCustomer('');
        setDiscount(0);
    };

    // --- Calculations ---
    const totals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price_sell * item.quantity), 0);
        const taxableAmount = Math.max(0, subtotal - discount);
        const taxAmount = taxableAmount * (taxRate / 100);
        const total = taxableAmount + taxAmount;
        return { subtotal, taxAmount, total };
    }, [cart, discount, taxRate]);

    // --- Transactions ---
    const processCheckout = async (paymentDetails) => {
        try {
            const txData = {
                items: cart,
                total: totals.total,
                discount,
                tax: totals.taxAmount,
                customer,
                payment_method: paymentDetails,
                date: new Date().toISOString()
            };

            await api.createTransaction(txData);

            // Return invoice data for printing
            const invoiceData = {
                id: uuidv4(),
                ...txData
            };

            playSound('success');
            success('Transaction successful!');
            clearCart();
            loadData(); // Refresh stock
            return invoiceData;
        } catch (err) {
            playSound('error');
            error(err.message || 'Transaction failed');
            throw err;
        }
    };

    // --- Hold/Recall ---
    const holdCurrentCart = async (customerName) => {
        if (cart.length === 0) return;
        try {
            await api.holdCart({ customer: customerName || customer || "Walk-in", items: cart });
            clearCart();
            success("Cart placed on hold");
            fetchHeldCarts(); // Refresh list
        } catch (err) {
            console.error(err);
            error("Failed to hold cart");
        }
    };

    const fetchHeldCarts = async () => {
        try {
            const carts = await api.getHeldCarts();
            setHeldCarts(carts);
        } catch (err) {
            console.error(err);
        }
    };

    const restoreHeldCart = async (heldCart) => {
        setCart(heldCart.items);
        setCustomer(heldCart.customer_name);
        await api.deleteHeldCart(heldCart.id);
        fetchHeldCarts();
        playSound('beep');
    };

    // --- Filtering ---
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))].sort(), [products]);

    return {
        products: filteredProducts,
        categories,
        cart,
        loading,
        totals,
        actions: {
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            setSearchTerm,
            setSelectedCategory,
            setCustomer,
            setDiscount,
            processCheckout,
            holdCurrentCart,
            fetchHeldCarts,
            restoreHeldCart
        },
        state: {
            searchTerm,
            selectedCategory,
            customer,
            discount,
            taxRate,
            heldCarts
        }
    };
};
