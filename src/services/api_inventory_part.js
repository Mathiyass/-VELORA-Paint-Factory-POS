
/**
 * Get all formulas
 * @returns {Promise<Array>}
 */
export const getFormulas = async () => {
    return await api.getFormulas();
};

/**
 * Add a new product
 * @param {Object} product 
 */
export const addProduct = async (product) => {
    return await api.addProduct(product);
};

/**
 * Update an existing product
 * @param {Object} product 
 */
export const updateProduct = async (product) => {
    return await api.updateProduct(product);
};

/**
 * Delete a product
 * @param {string} id 
 */
export const deleteProduct = async (id) => {
    return await api.deleteProduct(id);
};

/**
 * Trigger CSV import for products
 */
export const importProductsFromCSV = async () => {
    return await api.importProductsFromCSV();
};
