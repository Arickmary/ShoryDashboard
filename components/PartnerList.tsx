import React from 'react';
import type { InsuranceProduct } from '../types';
import { ProductCard } from './ProductCard';
import { Icon } from './Icon';

interface ProductListProps {
    products: InsuranceProduct[];
    onSelectProduct: (product: InsuranceProduct) => void;
}

export function ProductList({ products, onSelectProduct }: ProductListProps): React.ReactNode {
    if (products.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                <Icon name="search-x" className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold">No Policies Found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        );
    }
    return (
        <div className="divide-y divide-slate-200">
            {products.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onSelectProduct={onSelectProduct} 
                />
            ))}
        </div>
    );
}