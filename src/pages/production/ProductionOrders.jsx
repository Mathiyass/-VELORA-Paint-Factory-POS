
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { useProduction } from '../../hooks/useProduction';
import ProductionHeader from '../../components/production/ProductionHeader';
import OrderList from '../../components/production/OrderList';
import OrderModal from '../../components/production/OrderModal';

export default function ProductionOrders() {
    const { orders, formulas, loading, actions } = useProduction();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        actions.fetchOrdersData();
    }, [actions.fetchOrdersData]);

    return (
        <div className="h-full bg-[var(--color-bg-app)] text-[var(--color-text-primary)] p-8 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Activity className="text-cyan-500" size={32} />
                        Production Orders
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Manage manufacturing runs and batch execution</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={actions.autoPlan}
                        className="bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-bold"
                    >
                        <Activity size={18} /> Auto-Plan
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] font-bold"
                    >
                        Plan Production
                    </button>
                </div>
            </div>

            <OrderList
                orders={orders}
                onExecute={actions.completeOrder}
            />

            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={actions.createOrder}
                formulas={formulas}
            />
        </div>
    );
}
