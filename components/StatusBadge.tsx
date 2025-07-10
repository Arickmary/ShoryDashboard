
import React from 'react';
import type { PartnerStatus } from '../types';
import { STATUS_COLORS, STATUS_DOT_COLORS } from '../constants';

interface StatusBadgeProps {
    status: PartnerStatus;
}

export function StatusBadge({ status }: StatusBadgeProps): React.ReactNode {
    const colorClasses = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    const dotColor = STATUS_DOT_COLORS[status] || 'bg-gray-500';

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClasses}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${dotColor}`}></span>
            {status}
        </div>
    );
}
