import React, { useState, useMemo } from 'react';
import type { InsuranceProduct, InsuranceProductStatus } from '../types';
import { FilterControls } from './FilterControls';
import { ProductList } from './ProductList';

interface ProductsViewProps {
    products: InsuranceProduct[];
    onSelectProduct: (product: InsuranceProduct) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ products, onSelectProduct }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InsuranceProductStatus | 'all'>('all');

    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                if (statusFilter === 'all') return true;
                return product.status === statusFilter;
            })
            .filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.underwriter.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [products, searchTerm, statusFilter]);
    
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Insurance Policies</h1>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">All Policies</h2>
                    <FilterControls
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                    />
                </div>
                <ProductList products={filteredProducts} onSelectProduct={onSelectProduct} />
            </div>
        </>
    );
};