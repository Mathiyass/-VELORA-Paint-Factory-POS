
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onAdd }) {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAdd={onAdd} />
                ))}
            </div>
        </div>
    );
}
