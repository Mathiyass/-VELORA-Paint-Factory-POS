
/**
 * Get dashboard statistics
 * @returns {Promise<Object>}
 */
export const getDashboardStats = async () => {
    return await api.getDashboardStats();
};

/**
 * Get recent activity feed
 * @returns {Promise<Array>}
 */
export const getRecentActivity = async () => {
    return await api.getRecentActivity();
};

/**
 * Get all transactions (for history/charts)
 * @returns {Promise<Array>}
 */
export const getTransactions = async () => {
    return await api.getTransactions();
};

/**
 * Get sales broken down by category
 * @returns {Promise<Array>}
 */
export const getSalesByCategory = async () => {
    return await api.getSalesByCategory();
};

/**
 * Get AI Smart Insights
 * @returns {Promise<Object|null>}
 */
export const getSmartInsights = async () => {
    return await api.getSmartInsights();
};
