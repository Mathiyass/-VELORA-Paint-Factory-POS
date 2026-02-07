import { useState, useCallback } from 'react';
import * as api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useFinance = () => {
    const { success, error } = useToast();
    const [expenses, setExpenses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getExpenses();
            setExpenses(data || []);
        } catch (err) {
            console.error(err);
            error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    }, [error]);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getEmployees();
            setEmployees(data || []);
        } catch (err) {
            console.error(err);
            error("Failed to load employees");
        } finally {
            setLoading(false);
        }
    }, [error]);

    const addExpense = async (expense) => {
        try {
            await api.addExpense(expense);
            success("Expense recorded successfully");
            await fetchExpenses();
            return true;
        } catch (err) {
            console.error(err);
            error("Failed to add expense");
            return false;
        }
    };

    const deleteExpense = async (id) => {
        if (!window.confirm("Delete this expense record?")) return;
        try {
            await api.deleteExpense(id);
            success("Expense deleted");
            await fetchExpenses();
        } catch (err) {
            console.error(err);
            error("Failed to delete expense");
        }
    };

    const addEmployee = async (employee) => {
        try {
            await api.addEmployee(employee);
            success("Employee added successfully");
            await fetchEmployees();
            return true;
        } catch (err) {
            console.error(err);
            error("Failed to add employee");
            return false;
        }
    };

    const deleteEmployee = async (id) => {
        if (!window.confirm("Remove this employee?")) return;
        try {
            await api.deleteEmployee(id);
            success("Employee removed");
            await fetchEmployees();
        } catch (err) {
            console.error(err);
            error("Failed to delete employee");
        }
    };

    return {
        expenses,
        employees,
        loading,
        actions: {
            fetchExpenses,
            fetchEmployees,
            addExpense,
            deleteExpense,
            addEmployee,
            deleteEmployee
        }
    };
};
