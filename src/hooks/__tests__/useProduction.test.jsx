
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProduction } from '../useProduction';
import * as api from '../../services/api';
import { ToastProvider } from '../../context/ToastContext';

// Mock the API module
vi.mock('../../services/api', () => ({
    getChemicals: vi.fn(),
    getProducts: vi.fn(),
    getFormulas: vi.fn(),
    getProductionOrders: vi.fn(),
    createFormula: vi.fn(),
    deleteFormula: vi.fn(),
    createProductionOrder: vi.fn(),
    completeProductionOrder: vi.fn(),
    getAutoProductionPlan: vi.fn(),
}));

const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>;

describe('useProduction Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch initial data correctly', async () => {
        const mockFormulas = [{ id: '1', name: 'Formula 1' }];
        const mockChemicals = [{ id: 'c1', name: 'Chem 1' }];
        const mockProducts = [{ id: 'p1', name: 'Paint 1' }];

        api.getFormulas.mockResolvedValue(mockFormulas);
        api.getChemicals.mockResolvedValue(mockChemicals);
        api.getProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useProduction(), { wrapper });

        await act(async () => {
            await result.current.actions.fetchFormulasData();
        });

        expect(result.current.formulas).toEqual(mockFormulas);
        expect(result.current.chemicals).toEqual(mockChemicals);
        expect(result.current.products).toEqual(mockProducts);
        expect(result.current.loading).toBe(false);
    });

    it('should create a formula successfully', async () => {
        api.createFormula.mockResolvedValue({ id: '2', name: 'New Formula' });
        api.getFormulas.mockResolvedValue([{ id: '1', name: 'Formula 1' }, { id: '2', name: 'New Formula' }]);

        const { result } = renderHook(() => useProduction(), { wrapper });

        // Manually trigger initial fetch to ensure state is set
        await act(async () => {
            await result.current.actions.fetchFormulasData();
        });

        expect(api.getFormulas).toHaveBeenCalledTimes(1);

        let success;
        await act(async () => {
            success = await result.current.actions.createFormula({ name: 'New Formula' });
        });

        expect(success).toBe(true);
        expect(api.createFormula).toHaveBeenCalledWith({ name: 'New Formula' });
        // Verify refetch was called
        expect(api.getFormulas).toHaveBeenCalledTimes(2); // Initial fetch + after create
    });

    it('should fetch orders correctly', async () => {
        const mockOrders = [{ id: 'o1', status: 'Pending' }];
        api.getProductionOrders.mockResolvedValue(mockOrders);
        api.getFormulas.mockResolvedValue([]);

        const { result } = renderHook(() => useProduction(), { wrapper });

        await act(async () => {
            await result.current.actions.fetchOrdersData();
        });

        expect(result.current.orders).toEqual(mockOrders);
    });

    it('should complete an order', async () => {
        api.completeProductionOrder.mockResolvedValue({});
        api.getProductionOrders.mockResolvedValue([{ id: 'o1', status: 'Completed' }]);

        const { result } = renderHook(() => useProduction(), { wrapper });

        await act(async () => {
            await result.current.actions.completeOrder('o1');
        });

        expect(api.completeProductionOrder).toHaveBeenCalledWith('o1');
        expect(api.getProductionOrders).toHaveBeenCalled();
    });
});
