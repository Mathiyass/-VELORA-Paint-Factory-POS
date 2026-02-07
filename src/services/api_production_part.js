
/**
 * Get all chemicals
 * @returns {Promise<Array>}
 */
export const getChemicals = async () => {
    return await api.getChemicals();
};

/**
 * Create a new formula
 * @param {Object} formula 
 */
export const createFormula = async (formula) => {
    return await api.createFormula(formula);
};

/**
 * Delete a formula
 * @param {string} id 
 */
export const deleteFormula = async (id) => {
    return await api.deleteFormula(id);
};

/**
 * Get all production orders
 * @returns {Promise<Array>}
 */
export const getProductionOrders = async () => {
    return await api.getProductionOrders();
};

/**
 * Create a production order
 * @param {Object} order 
 */
export const createProductionOrder = async (order) => {
    return await api.createProductionOrder(order);
};

/**
 * Complete a production order
 * @param {string} id 
 */
export const completeProductionOrder = async (id) => {
    return await api.completeProductionOrder(id);
};

/**
 * Get auto-production plan suggestions
 * @returns {Promise<Array>}
 */
export const getAutoProductionPlan = async () => {
    return await api.getAutoProductionPlan();
};
