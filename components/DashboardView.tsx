
import React from 'react';
import type { Product, Partner } from '../types';
import { StatsSection } from './StatsSection';
import { Icon } from './Icon';
import { ProductStatusChart } from './ProductStatusChart';
import { RecentUpdates } from './RecentUpdates';

interface DashboardViewProps {
    products: Product[];
    partners: Partner[];
}

const StatCard: React.FC<{ label: string; value: number | string; iconName: React.ComponentProps<typeof Icon>['name']; color: string; }> = ({ label, value, iconName, color }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon name={iconName} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ products, partners }) => {
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here's a snapshot of your product portfolio.</p>
                </div>
                <button className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <Icon name="bell" className="w-6 h-6 text-slate-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard label="Total Products" value={products.length} iconName="package" color="bg-slate-800" />
                 <StatCard label="Total Partners" value={partners.length} iconName="users" color="bg-sky-500" />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Partner Status Distribution</h2>
                    <ProductStatusChart partners={partners} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Recent Partners</h2>
                    <RecentUpdates partners={partners} />
                </div>
            </div>
        </>
    );
};
