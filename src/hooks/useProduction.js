
import { useState, useCallback, useEffect } from 'react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useProduction = () => {
    const { success, error } = useToast();
    const [formulas, setFormulas] = useState([]);
    const [chemicals, setChemicals] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFormulasData = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedFormulas, fetchedChemicals, fetchedProducts] = await Promise.all([
                api.getFormulas(),
                api.getChemicals(),
                api.getProducts()
            ]);
            setFormulas(fetchedFormulas || []);
            setChemicals(fetchedChemicals || []);
            setProducts(fetchedProducts || []);
        } catch (err) {
            console.error(err);
            error("Failed to load formula data");
        } finally {
            setLoading(false);
        }
    }, [error]);

    const fetchOrdersData = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedOrders, fetchedFormulas] = await Promise.all([
                api.getProductionOrders(),
                api.getFormulas()
            ]);
            setOrders(fetchedOrders || []);
            setFormulas(fetchedFormulas || []);
        } catch (err) {
            console.error(err);
            error("Failed to load production orders");
        } finally {
            setLoading(false);
        }
    }, [error]);

    const createFormula = async (formula) => {
        try {
            await api.createFormula(formula);
            success("Formula created successfully");
            await fetchFormulasData();
            return true;
        } catch (err) {
            console.error(err);
            error("Failed to save formula");
            return false;
        }
    };

    const deleteFormula = async (id) => {
        if (!window.confirm("Delete this formula?")) return;
        try {
            await api.deleteFormula(id);
            success("Formula deleted");
            await fetchFormulasData();
        } catch (err) {
            console.error(err);
            error("Failed to delete formula");
        }
    };

    const createOrder = async (order) => {
        try {
            await api.createProductionOrder(order);
            success("Production order created");
            await fetchOrdersData();
            return true;
        } catch (err) {
            console.error(err);
            error("Failed to create order");
            return false;
        }
    };

    const completeOrder = async (id) => {
        if (!window.confirm("Execute production order? This will deduct chemicals and add stock.")) return;
        try {
            await api.completeProductionOrder(id);
            success("Production completed successfully");
            await fetchOrdersData();
        } catch (err) {
            console.error(err);
            error("Failed to complete order: " + err.message);
        }
    };

    const autoPlan = async () => {
        try {
            const suggestions = await api.getAutoProductionPlan();
            if (suggestions.length === 0) {
                success('Stock levels are healthy. No auto-plans needed.');
                return;
            }

            if (window.confirm(`Found ${suggestions.length} low stock items. Create orders?`)) {
                let count = 0;
                for (const s of suggestions) {
                    await api.createProductionOrder({
                        formula_id: s.formula_id,
                        quantity_planned: s.quantity_planned
                    });
                    count++;
                }
                success(`Created ${count} production orders.`);
                await fetchOrdersData();
            }
        } catch (err) {
            console.error(err);
            error("Auto-plan failed");
        }
    };

    return {
        formulas,
        chemicals,
        products,
        orders,
        loading,
        actions: {
            fetchFormulasData,
            fetchOrdersData,
            createFormula,
            deleteFormula,
            createOrder,
            completeOrder,
            autoPlan
        }
    };
};
