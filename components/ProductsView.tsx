
import React from 'react';
import type { Product, Partner } from '../types';
import { Icon } from './Icon';

interface ProductsViewProps {
    products: Product[];
    partners: Partner[];
}

const ProductCard: React.FC<{ product: Product, partnerCount: number }> = ({ product, partnerCount }) => {
    const handleNavigate = (e: React.MouseEvent) => {
        e.preventDefault();
        window.history.pushState({}, '', `/products/${product.id}`);
    }
    return (
         <a href={`/products/${product.id}`} onClick={handleNavigate} className="block bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-sky-500 transition-all duration-300 group">
            <div className="flex items-start space-x-4">
                 <img src={product.icon_url} alt={`${product.name} icon`} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                 <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{product.name}</h3>
                    <p className="text-slate-500 mt-1 text-sm line-clamp-2">{product.description}</p>
                 </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
                <div className="flex items-center text-slate-600 font-medium">
                    <Icon name="users" className="w-4 h-4 mr-2" />
                    <span>{partnerCount} {partnerCount === 1 ? 'Partner' : 'Partners'}</span>
                </div>
                <div className="flex items-center text-sky-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    View Partners <Icon name="arrow-right" className="w-4 h-4 ml-1" />
                </div>
            </div>
        </a>
    )
}

export const ProductsView: React.FC<ProductsViewProps> = ({ products, partners }) => {

    const getPartnerCountForProduct = (productId: string): number => {
        return partners.filter(p => p.product_id === productId).length;
    };
    
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">All Products</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        partnerCount={getPartnerCountForProduct(product.id)}
                    />
                ))}
                 {products.length === 0 && (
                    <div className="md:col-span-3 text-center py-12 text-slate-500">
                        <Icon name="package" className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-xl font-semibold">No Products Found</h3>
                        <p>Your product lines will appear here once added.</p>
                    </div>
                )}
            </div>
        </>
    );
};
