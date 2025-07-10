import React from 'react';
import type { Partner } from '../types';
import { PartnerCard } from './PartnerCard';
import { Icon } from './Icon';

interface PartnerListProps {
    partners: Partner[];
    onSelectPartner: (partner: Partner) => void;
}

export function PartnerList({ partners, onSelectPartner }: PartnerListProps): React.ReactNode {
    if (partners.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                <Icon name="search-x" className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold">No Partners Found</h3>
                <p>Try adjusting your search or filter criteria, or add a new partner.</p>
            </div>
        );
    }
    return (
        <div className="divide-y divide-slate-200">
            {partners.map(partner => (
                <PartnerCard 
                    key={partner.id} 
                    partner={partner} 
                    onSelectPartner={onSelectPartner} 
                />
            ))}
        </div>
    );
}