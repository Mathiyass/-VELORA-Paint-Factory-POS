
import { useState, useEffect } from 'react';
import { Microscope } from 'lucide-react';
import { useProduction } from '../../hooks/useProduction';
import ProductionHeader from '../../components/production/ProductionHeader';
import FormulaList from '../../components/production/FormulaList';
import FormulaModal from '../../components/production/FormulaModal';

export default function Formulas() {
    const { formulas, chemicals, products, loading, actions } = useProduction();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        actions.fetchFormulasData();
    }, [actions.fetchFormulasData]);

    if (loading && formulas.length === 0) {
        return <div className="p-8 text-zinc-500">Loading formulas...</div>;
    }

    return (
        <div className="h-full flex flex-col p-8 bg-[var(--color-bg-app)] text-zinc-100 overflow-y-auto custom-scrollbar">
            <ProductionHeader
                title="Formulas & Recipes"
                subtitle="Define chemical compositions for products"
                onAction={() => setIsModalOpen(true)}
                actionLabel="New Formula"
            // icon={Microscope} // optional, header can handle it
            />

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search formulas..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                </div>
            </div>

            <FormulaList
                formulas={formulas}
                search={search}
                onDelete={actions.deleteFormula}
            />

            <FormulaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={actions.createFormula}
                chemicals={chemicals}
                products={products}
            />
        </div>
    );
}
