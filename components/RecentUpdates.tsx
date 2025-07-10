
import React, { useMemo } from 'react';
import type { Partner } from '../types';
import { Icon } from './Icon';

interface RecentUpdatesProps {
    partners: Partner[];
    onOpenAddModal?: () => void;
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

export const RecentUpdates: React.FC<RecentUpdatesProps> = ({ partners, onOpenAddModal }) => {
    const recentPartners = useMemo(() => {
        return [...partners]
            .sort((a, b) => new Date(b.join_date).getTime() - new Date(a.join_date).getTime())
            .slice(0, 4);
    }, [partners]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                 {onOpenAddModal && (
                    <button 
                        onClick={onOpenAddModal}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-sky-500 text-white rounded-lg text-base font-semibold hover:bg-sky-600 transition-all shadow-sm mb-6"
                    >
                        <Icon name="plus-circle" className="w-5 h-5" />
                        <span>Add New Partner</span>
                    </button>
                 )}
                <div className="space-y-4">
                    {recentPartners.map(partner => (
                        <div key={partner.id} className="flex items-center space-x-3">
                            <img src={partner.logo_url} alt={partner.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{partner.name}</p>
                                <p className="text-sm text-slate-500">
                                    Joined
                                </p>
                            </div>
                            <div className="text-sm text-slate-400 font-medium flex-shrink-0">{timeAgo(partner.join_date)}</div>
                        </div>
                    ))}
                    {recentPartners.length === 0 && (
                         <div className="text-center py-6 text-slate-500">
                            <Icon name="users" className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                            <h3 className="font-semibold">No Partners Yet</h3>
                            <p className="text-xs">Add your first partner to this product.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
