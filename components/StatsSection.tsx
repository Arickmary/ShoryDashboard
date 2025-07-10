
import React from 'react';
import type { Product, Partner } from '../types';
import { PartnerStatus } from '../types';
import { Icon } from './Icon';

interface StatsSectionProps {
    items: Product[] | Partner[];
    type: 'products' | 'partners';
}

interface StatCardProps {
    label: string;
    value: number;
    iconName: 'package' | 'check-circle' | 'users' | 'zap' | 'alert-triangle';
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, iconName, color }) => (
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


export function StatsSection({ items, type }: StatsSectionProps): React.ReactNode {
    
    if (type === 'products') {
        const products = items as Product[];
        const partners = []; // In this view, we only get products
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Products" value={products.length} iconName="package" color="bg-slate-800" />
                <StatCard label="Total Partners" value={partners.length} iconName="users" color="bg-sky-500" />
                <StatCard label="Active Partners" value={0} iconName="check-circle" color="bg-emerald-500" />
                <StatCard label="Onboarding" value={0} iconName="zap" color="bg-amber-500" />
            </div>
        );
    }
    
    const partners = items as Partner[];
    const total = partners.length;
    const active = partners.filter(p => p.status === PartnerStatus.Active).length;
    const onboarding = partners.filter(p => p.status === PartnerStatus.Onboarding).length;
    const inactive = partners.filter(p => p.status === PartnerStatus.Inactive).length;
    
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Partners" value={total} iconName="users" color="bg-slate-800" />
            <StatCard label="Active" value={active} iconName="check-circle" color="bg-emerald-500" />
            <StatCard label="Onboarding" value={onboarding} iconName="zap" color="bg-sky-500" />
            <StatCard label="Inactive" value={inactive} iconName="alert-triangle" color="bg-slate-500" />
        </div>
    );
}
