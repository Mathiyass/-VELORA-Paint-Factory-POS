import React from 'react';
import { useCustomers } from '../hooks/useCustomers';
import CustomerForm from '../components/customers/CustomerForm';
import CustomerList from '../components/customers/CustomerList';
import CustomerHistoryModal from '../components/customers/CustomerHistoryModal';

export default function Customers() {
  const {
    customers,
    search,
    formData,
    loading,
    historyModalOpen,
    selectedCustomer,
    customerHistory,
    actions
  } = useCustomers();

  return (
    <div className="h-full flex gap-6 p-8 overflow-hidden bg-[var(--color-bg-app)] text-zinc-100 relative font-sans">

      <CustomerForm
        formData={formData}
        setFormData={actions.setFormData}
        handleSubmit={actions.handleSubmit}
        loading={loading}
      />

      <CustomerList
        customers={customers}
        search={search}
        setSearch={actions.setSearch}
        handleViewHistory={actions.handleViewHistory}
        handleDelete={actions.handleDelete}
      />

      <CustomerHistoryModal
        historyModalOpen={historyModalOpen}
        setHistoryModalOpen={actions.setHistoryModalOpen}
        selectedCustomer={selectedCustomer}
        customerHistory={customerHistory}
      />

    </div>
  );
}