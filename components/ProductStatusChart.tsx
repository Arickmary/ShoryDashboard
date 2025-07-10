
import React, { useMemo } from 'react';
import type { Partner } from '../types';
import { PartnerStatus } from '../types';
import { STATUS_DOT_COLORS } from '../constants';

interface ProductStatusChartProps {
    partners: Partner[];
}

const statusOrder: PartnerStatus[] = [
    PartnerStatus.Active,
    PartnerStatus.Onboarding,
    PartnerStatus.Inactive,
];

export const ProductStatusChart: React.FC<ProductStatusChartProps> = ({ partners }) => {
    const statusCounts = useMemo(() => {
        const counts = partners.reduce((acc, partner) => {
            acc[partner.status] = (acc[partner.status] || 0) + 1;
            return acc;
        }, {} as Record<PartnerStatus, number>);
        
        statusOrder.forEach(status => {
            if (!counts[status]) {
                counts[status] = 0;
            }
        });
        
        return counts;
    }, [partners]);

    const maxCount = useMemo(() => Math.max(1, ...Object.values(statusCounts)), [statusCounts]);
    
    return (
        <div className="space-y-4 pt-2">
            {statusOrder.map(status => {
                const count = statusCounts[status];
                const percentage = (count / maxCount) * 100;
                const barColor = STATUS_DOT_COLORS[status].replace('bg-', 'bg-');

                return (
                    <div key={status} className="grid grid-cols-12 items-center gap-4 text-sm">
                        <div className="col-span-3 font-medium text-slate-600">{status}</div>
                        <div className="col-span-8">
                            <div className="w-full bg-slate-200 rounded-full h-4">
                                <div 
                                    className={`h-4 rounded-full ${barColor} transition-all duration-500 ease-out`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="col-span-1 text-right font-semibold text-slate-800">{count}</div>
                    </div>
                );
            })}
        </div>
    );
};
