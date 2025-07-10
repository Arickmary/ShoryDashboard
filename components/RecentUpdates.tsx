import React, { useMemo } from 'react';
import type { InsuranceProduct } from '../types';
import { Icon } from './Icon';

interface RecentUpdatesProps {
    products: InsuranceProduct[];
    onOpenAddModal: () => void;
}

const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

export const RecentUpdates: React.FC<RecentUpdatesProps> = ({ products, onOpenAddModal }) => {
    const recentProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
            .slice(0, 4);
    }, [products]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                 <button 
                    onClick={onOpenAddModal}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-sky-500 text-white rounded-lg text-base font-semibold hover:bg-sky-600 transition-all shadow-sm mb-6"
                 >
                    <Icon name="plus-circle" className="w-5 h-5" />
                    <span>Add New Policy</span>
                </button>
                <div className="space-y-4">
                    {recentProducts.map(product => (
                        <div key={product.id} className="flex items-center space-x-3">
                            <img src={product.iconUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{product.name}</p>
                                <p className="text-sm text-slate-500">
                                    Updated by {product.underwriter.name.split(' ')[0]}
                                </p>
                            </div>
                            <div className="text-sm text-slate-400 font-medium flex-shrink-0">{timeAgo(product.lastUpdate)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};