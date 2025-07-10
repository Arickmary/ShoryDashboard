import React, { useMemo } from 'react';
import type { InsuranceProduct } from '../types';
import { InsuranceProductStatus } from '../types';
import { STATUS_DOT_COLORS } from '../constants';

interface ProductStatusChartProps {
    products: InsuranceProduct[];
}

const statusOrder: InsuranceProductStatus[] = [
    InsuranceProductStatus.Active,
    InsuranceProductStatus.Pilot,
    InsuranceProductStatus.InReview,
    InsuranceProductStatus.Discontinued,
];

export const ProductStatusChart: React.FC<ProductStatusChartProps> = ({ products }) => {
    const statusCounts = useMemo(() => {
        const counts = products.reduce((acc, product) => {
            acc[product.status] = (acc[product.status] || 0) + 1;
            return acc;
        }, {} as Record<InsuranceProductStatus, number>);
        
        // Ensure all statuses have a count, even if 0
        statusOrder.forEach(status => {
            if (!counts[status]) {
                counts[status] = 0;
            }
        });
        
        return counts;
    }, [products]);

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