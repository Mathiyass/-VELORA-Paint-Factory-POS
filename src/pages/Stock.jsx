
import React from 'react';
import { useInventory } from '../hooks/useInventory';
import InventoryHeader from '../components/inventory/InventoryHeader';
import InventoryControls from '../components/inventory/InventoryControls';
import ProductGrid from '../components/inventory/ProductGrid';
import ProductModal from '../components/inventory/ProductModal';

export default function Stock() {
  const {
    products,
    formulas,
    categories,
    loading,
    state,
    actions
  } = useInventory();

  if (loading && products.length === 0) {
    return <div className="p-8 text-zinc-500">Loading inventory...</div>;
  }

  return (
    <div className="h-full bg-[var(--color-bg-app)] text-zinc-100 flex flex-col font-sans">
      <div className="p-8 pb-0">
        <InventoryHeader
          onImport={actions.handleImport}
          onAdd={actions.openAddModal}
        />

        <InventoryControls
          searchTerm={state.searchTerm}
          setSearchTerm={actions.setSearchTerm}
          filterLowStock={state.filterLowStock}
          setFilterLowStock={actions.setFilterLowStock}
          selectedCategory={state.selectedCategory}
          setSelectedCategory={actions.setSelectedCategory}
          categories={categories}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
        <ProductGrid
          products={products}
          onEdit={actions.openEditModal}
          onDelete={actions.handleDelete}
        />
      </div>

      <ProductModal
        isOpen={state.isModalOpen}
        isEditing={state.isEditing}
        formData={state.formData}
        onClose={actions.closeModal}
        onChange={actions.handleInputChange}
        onSubmit={actions.handleSubmit}
        formulas={formulas}
      />
    </div>
  );
}