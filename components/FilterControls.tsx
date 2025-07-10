import React from 'react';
import { InsuranceProductStatus } from '../types';
import { Icon } from './Icon';

interface FilterControlsProps {
    statusFilter: InsuranceProductStatus | 'all';
    onStatusFilterChange: (status: InsuranceProductStatus | 'all') => void;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

export function FilterControls({ statusFilter, onStatusFilterChange, searchTerm, onSearchTermChange }: FilterControlsProps): React.ReactNode {
    const statuses = ['all', ...Object.values(InsuranceProductStatus)];
    
    return (
        <div className="flex items-center space-x-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="w-5 h-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
            </div>
            
            <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as InsuranceProductStatus | 'all')}
                className="py-2 pr-8 pl-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-white"
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status}
                    </option>
                ))}
            </select>
        </div>
    );
}