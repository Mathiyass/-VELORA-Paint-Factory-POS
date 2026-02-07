
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFinance } from '../useFinance';
import * as api from '../../services/api';
import { ToastProvider } from '../../context/ToastContext';

// Mock the API module
vi.mock('../../services/api', () => ({
    getExpenses: vi.fn(),
    addExpense: vi.fn(),
    deleteExpense: vi.fn(),
    getEmployees: vi.fn(),
    addEmployee: vi.fn(),
    deleteEmployee: vi.fn(),
}));

const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;

describe('useFinance Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch expenses correctly', async () => {
        const mockExpenses = [{ id: 'e1', amount: 100 }];
        api.getExpenses.mockResolvedValue(mockExpenses);

        const { result } = renderHook(() => useFinance(), { wrapper });

        await act(async () => {
            await result.current.actions.fetchExpenses();
        });

        expect(result.current.expenses).toEqual(mockExpenses);
        expect(result.current.loading).toBe(false);
    });

    it('should add an expense', async () => {
        api.addExpense.mockResolvedValue({});
        api.getExpenses.mockResolvedValue([{ id: 'e1', amount: 100 }]);

        const { result } = renderHook(() => useFinance(), { wrapper });

        let success;
        await act(async () => {
            success = await result.current.actions.addExpense({ amount: 100 });
        });

        expect(success).toBe(true);
        expect(api.addExpense).toHaveBeenCalledWith({ amount: 100 });
        expect(api.getExpenses).toHaveBeenCalled();
    });

    it('should fetch employees correctly', async () => {
        const mockEmployees = [{ id: 'em1', name: 'John' }];
        api.getEmployees.mockResolvedValue(mockEmployees);

        const { result } = renderHook(() => useFinance(), { wrapper });

        await act(async () => {
            await result.current.actions.fetchEmployees();
        });

        expect(result.current.employees).toEqual(mockEmployees);
    });

    it('should delete an employee', async () => {
        // Mock window.confirm
        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => true);

        api.deleteEmployee.mockResolvedValue({});
        api.getEmployees.mockResolvedValue([]);

        const { result } = renderHook(() => useFinance(), { wrapper });

        await act(async () => {
            await result.current.actions.deleteEmployee('em1');
        });

        expect(api.deleteEmployee).toHaveBeenCalledWith('em1');
        expect(api.getEmployees).toHaveBeenCalled();

        confirmSpy.mockRestore();
    });
});
