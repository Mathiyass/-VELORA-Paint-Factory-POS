
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiService from './api';

describe('API Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getProducts', () => {
        it('should fetch products successfully', async () => {
            const mockProducts = [{ id: '1', name: 'Product 1' }];
            window.api.getProducts.mockResolvedValue(mockProducts);

            const result = await apiService.getProducts();

            expect(result).toEqual(mockProducts);
            expect(window.api.getProducts).toHaveBeenCalledTimes(1);
        });

        it('should throw an error and log it when fetching products fails', async () => {
            const error = new Error('Fetch failed');
            window.api.getProducts.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(apiService.getProducts()).rejects.toThrow('Fetch failed');
            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch products:', error);

            consoleSpy.mockRestore();
        });
    });

    describe('getCustomers', () => {
        it('should fetch customers successfully', async () => {
            const mockCustomers = [{ id: '1', name: 'Customer 1' }];
            window.api.getCustomers.mockResolvedValue(mockCustomers);

            const result = await apiService.getCustomers();

            expect(result).toEqual(mockCustomers);
            expect(window.api.getCustomers).toHaveBeenCalledTimes(1);
        });

        it('should throw an error and log it when fetching customers fails', async () => {
            const error = new Error('Fetch failed');
            window.api.getCustomers.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(apiService.getCustomers()).rejects.toThrow('Fetch failed');
            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch customers:', error);

            consoleSpy.mockRestore();
        });
    });

    describe('createTransaction', () => {
        it('should create a transaction successfully', async () => {
            const transactionData = { total: 100 };
            window.api.createTransaction.mockResolvedValue({ success: true });

            const result = await apiService.createTransaction(transactionData);

            expect(result).toEqual({ success: true });
            expect(window.api.createTransaction).toHaveBeenCalledWith(transactionData);
        });

        it('should throw an error and log it when creating a transaction fails', async () => {
            const error = new Error('Transaction failed');
            window.api.createTransaction.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            await expect(apiService.createTransaction({})).rejects.toThrow('Transaction failed');
            expect(consoleSpy).toHaveBeenCalledWith('Transaction failed:', error);

            consoleSpy.mockRestore();
        });
    });

    describe('getSettings', () => {
        it('should fetch settings successfully', async () => {
            const mockSettings = { currency: 'USD' };
            window.api.getSettings.mockResolvedValue(mockSettings);

            const result = await apiService.getSettings();

            expect(result).toEqual(mockSettings);
        });

        it('should return an empty object and log error when fetching settings fails', async () => {
            const error = new Error('Settings failed');
            window.api.getSettings.mockRejectedValue(error);
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const result = await apiService.getSettings();

            expect(result).toEqual({});
            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch settings:', error);

            consoleSpy.mockRestore();
        });
    });

    describe('Pass-through functions', () => {
        it('holdCart should call window.api.holdCart', async () => {
            const data = { items: [] };
            await apiService.holdCart(data);
            expect(window.api.holdCart).toHaveBeenCalledWith(data);
        });

        it('getDashboardStats should call window.api.getDashboardStats', async () => {
            window.api.getDashboardStats.mockResolvedValue({ totalSales: 100 });
            const result = await apiService.getDashboardStats();
            expect(result).toEqual({ totalSales: 100 });
            expect(window.api.getDashboardStats).toHaveBeenCalled();
        });

        it('addProduct should call window.api.addProduct', async () => {
            const product = { name: 'New' };
            await apiService.addProduct(product);
            expect(window.api.addProduct).toHaveBeenCalledWith(product);
        });

        it('deleteFormula should call window.api.deleteFormula', async () => {
            await apiService.deleteFormula('123');
            expect(window.api.deleteFormula).toHaveBeenCalledWith('123');
        });

        it('getBatches should call window.api.getBatches', async () => {
            const chemId = 'chem123';
            window.api.getBatches.mockResolvedValue([]);
            await apiService.getBatches(chemId);
            expect(window.api.getBatches).toHaveBeenCalledWith(chemId);
        });
    });
});
