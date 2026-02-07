
import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useInventory = () => {
    const { success, error } = useToast();
    const [products, setProducts] = useState([]);
    const [formulas, setFormulas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filterLowStock, setFilterLowStock] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const initialFormState = {
        id: null, name: '', sku: '', category: 'General',
        price_buy: '', price_sell: '', stock: '',
        image: '', warranty: '', formula_id: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedProducts, fetchedFormulas] = await Promise.all([
                api.getProducts(),
                api.getFormulas()
            ]);
            setProducts(fetchedProducts || []);
            setFormulas(fetchedFormulas || []);
        } catch (err) {
            console.error(err);
            error("Failed to load inventory data");
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchesLowStock = filterLowStock ? p.stock < 10 : true;

            return matchesSearch && matchesCategory && matchesLowStock;
        });
    }, [products, searchTerm, selectedCategory, filterLowStock]);

    const categories = useMemo(() =>
        ['All', ...new Set(products.map(p => p.category))].sort(),
        [products]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setFormData({
            ...product,
            price_buy: product.price_buy || '',
            price_sell: product.price_sell || '',
            stock: product.stock || '',
            image: product.image || '',
            warranty: product.warranty || '',
            formula_id: product.formula_id || ''
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price_buy: parseFloat(formData.price_buy) || 0,
                price_sell: parseFloat(formData.price_sell) || 0,
                stock: parseInt(formData.stock) || 0,
                formula_id: formData.formula_id ? parseInt(formData.formula_id) : null
            };

            if (isEditing) {
                await api.updateProduct(productData);
                success("Product updated successfully");
            } else {
                await api.addProduct(productData);
                success("Product created successfully");
            }
            setIsModalOpen(false);
            await loadData();
        } catch (err) {
            console.error(err);
            error("Operation failed: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await api.deleteProduct(id);
            await loadData();
            success("Product deleted");
        } catch (err) {
            console.error(err);
            error("Failed to delete product");
        }
    };

    const handleImport = async () => {
        try {
            await api.importProductsFromCSV();
            // Re-load data might be needed if import is synchronous or sends an event
            // Assuming we manually reload for now or the user refreshes
            loadData();
        } catch (err) {
            console.error(err);
            error("Import failed");
        }
    };

    return {
        products: filteredProducts,
        formulas,
        categories,
        loading,
        state: {
            searchTerm,
            selectedCategory,
            filterLowStock,
            isModalOpen,
            isEditing,
            formData
        },
        actions: {
            setSearchTerm,
            setSelectedCategory,
            setFilterLowStock,
            handleInputChange,
            openAddModal,
            openEditModal,
            closeModal,
            handleSubmit,
            handleDelete,
            handleImport
        }
    };
};
