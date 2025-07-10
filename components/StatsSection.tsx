import React, { useMemo } from 'react';
import type { InsuranceProduct } from '../types';
import { InsuranceProductStatus } from '../types';
import { Icon } from './Icon';

interface StatsSectionProps {
    products: InsuranceProduct[];
}

interface StatCardProps {
    label: string;
    value: number;
    iconName: 'package' | 'check-circle' | 'clock' | 'alert-triangle';
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


export function StatsSection({ products }: StatsSectionProps): React.ReactNode {
    const stats = useMemo(() => {
        const total = products.length;
        const active = products.filter(p => p.status === InsuranceProductStatus.Active).length;
        const inReview = products.filter(p => p.status === InsuranceProductStatus.InReview).length;
        const discontinued = products.filter(p => p.status === InsuranceProductStatus.Discontinued).length;
        return { total, active, inReview, discontinued };
    }, [products]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Policies" value={stats.total} iconName="package" color="bg-slate-800" />
            <StatCard label="Active Policies" value={stats.active} iconName="check-circle" color="bg-emerald-500" />
            <StatCard label="In Review" value={stats.inReview} iconName="clock" color="bg-sky-500" />
            <StatCard label="Discontinued" value={stats.discontinued} iconName="alert-triangle" color="bg-red-500" />
        </div>
    );
}