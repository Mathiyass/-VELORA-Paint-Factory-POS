import React from 'react';
import { useHistory } from '../hooks/useHistory';
import HistoryHeader from '../components/history/HistoryHeader';
import TransactionList from '../components/history/TransactionList';
import TransactionDetails from '../components/history/TransactionDetails';
import Invoice from '../components/Invoice';
import { AnimatePresence } from 'framer-motion';

export default function History() {
    const {
        transactions,
        selectedTx,
        loading,
        searchTerm,
        editMode,
        editData,
        invoiceData,
        actions
    } = useHistory();

    if (loading && transactions.length === 0) {
        return <div className="p-8 text-zinc-500">Loading history...</div>;
    }

    return (
        <div className="h-full flex flex-col bg-[var(--color-bg-app)] text-zinc-100 font-sans selection:bg-cyan-500/30">
            <HistoryHeader
                transactionCount={transactions.length}
                searchTerm={searchTerm}
                onSearchChange={actions.setSearchTerm}
            />

            <div className="flex-1 flex gap-6 overflow-hidden p-6 pt-2">
                <TransactionList
                    transactions={transactions}
                    selectedId={selectedTx?.id}
                    onSelect={actions.openDetails}
                />

                <AnimatePresence>
                    {selectedTx && (
                        <TransactionDetails
                            selectedTx={selectedTx}
                            editMode={editMode}
                            editData={editData}
                            actions={actions}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Invoice Overlay */}
            {invoiceData && (
                <Invoice
                    data={invoiceData}
                    onClose={actions.closeInvoice}
                />
            )}
        </div>
    );
}