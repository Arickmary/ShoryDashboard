
import React from 'react';
import type { Partner } from '../types';
import { StatusBadge } from './StatusBadge';
import { Icon } from './Icon';

interface PartnerCardProps {
    partner: Partner;
    onSelectPartner: (partner: Partner) => void;
}

export function ProductCard({ partner, onSelectPartner }: PartnerCardProps): React.ReactNode {
    
    const timeAgo = (date: string): string => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-lg group">
            <div className="flex items-center space-x-4">
                <img src={partner.logo_url} alt={`${partner.name} logo`} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{partner.name}</h3>
                    <p className="text-sm text-slate-500">
                        Contact: {partner.contact_person.name}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center space-x-8">
                <div className="text-sm text-slate-500">
                    <p>Joined</p>
                    <p className="font-medium text-slate-700">{timeAgo(partner.join_date)}</p>
                </div>
                
                <div className="w-40">
                    <StatusBadge status={partner.status} />
                </div>
            </div>

            <button 
                onClick={() => onSelectPartner(partner)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-sm group-hover:opacity-100 md:opacity-0 focus:opacity-100"
            >
                <span>View Details</span>
                <Icon name="arrow-right" className="w-4 h-4" />
            </button>
        </div>
    );
}
