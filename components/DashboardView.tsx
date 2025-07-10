import React from 'react';
import type { InsuranceProduct } from '../types';
import { StatsSection } from './StatsSection';
import { Icon } from './Icon';
import { ProductStatusChart } from './ProductStatusChart';
import { RecentUpdates } from './RecentUpdates';

interface DashboardViewProps {
    products: InsuranceProduct[];
    onOpenAddModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ products, onOpenAddModal }) => {
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here's a snapshot of your insurance portfolio.</p>
                </div>
                <button className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <Icon name="bell" className="w-6 h-6 text-slate-500" />
                </button>
            </div>

            <StatsSection products={products} />

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Policy Status Distribution</h2>
                    <ProductStatusChart products={products} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Activity</h2>
                    <RecentUpdates products={products} onOpenAddModal={onOpenAddModal} />
                </div>
            </div>
        </>
    );
};