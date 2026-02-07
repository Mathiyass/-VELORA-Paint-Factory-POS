
import { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';
import FinanceHeader from '../../components/finance/FinanceHeader';
import ExpenseList from '../../components/finance/ExpenseList';
import ExpenseModal from '../../components/finance/ExpenseModal';

export default function Expenses() {
    const { expenses, actions } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        actions.fetchExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-[var(--color-text-primary)] p-8 overflow-y-auto custom-scrollbar">
            <FinanceHeader
                title="Expenses"
                subtitle="Track operational costs and overheads"
                icon={DollarSign}
                onAction={() => setIsModalOpen(true)}
                actionLabel="Add Expense"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                    <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Expenses</h3>
                    <div className="text-3xl font-bold text-white mt-1">LKR {totalExpenses.toLocaleString()}</div>
                    <p className="text-xs text-zinc-500 mt-2">All time record</p>
                </div>
            </div>

            <ExpenseList
                expenses={expenses}
                onDelete={actions.deleteExpense}
            />

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={actions.addExpense}
            />
        </div>
    );
}
