
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onEdit, onDelete }) {
    if (products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-zinc-500">
                No products found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(p => (
                <ProductCard key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}
