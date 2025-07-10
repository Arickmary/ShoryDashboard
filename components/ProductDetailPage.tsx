import React, { useState, useMemo } from 'react';
import type { Product, Partner, PartnerStatus, NewPartner } from '../types';
import { FilterControls } from './FilterControls';
import { PartnerList } from './PartnerList';
import { StatsSection } from './StatsSection';
import { PartnerDetailModal } from './PartnerDetailModal';
import { PartnerFormModal } from './PartnerFormModal';
import { RecentUpdates } from './RecentUpdates';
import { Icon } from './Icon';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface ProductDetailPageProps {
    product: Product;
    allPartners: Partner[];
    setAllPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
    session: Session;
}

// Helper function to map Supabase data to our application's partner type
const mapSupabaseToPartner = (p: any): Partner => ({
    id: p.id,
    created_at: p.created_at,
    product_id: p.product_id,
    name: p.name,
    status: p.status,
    join_date: p.join_date,
    contact_person: p.contact_person,
    description: p.description,
    logo_url: p.logo_url,
});

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, allPartners, setAllPartners, session }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<PartnerStatus | 'all'>('all');
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);

    const productPartners = useMemo(() => {
        return allPartners.filter(p => p.product_id === product.id);
    }, [allPartners, product.id]);

    const filteredPartners = useMemo(() => {
        return productPartners
            .filter(partner => {
                if (statusFilter === 'all') return true;
                return partner.status === statusFilter;
            })
            .filter(partner =>
                partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                partner.contact_person.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [productPartners, searchTerm, statusFilter]);
    
    const handleSelectPartner = (partner: Partner): void => setSelectedPartner(partner);
    const handleCloseDetailModal = (): void => setSelectedPartner(null);
    const handleOpenAddModal = (): void => {
        setPartnerToEdit(null);
        setIsFormModalOpen(true);
    };
    const handleOpenEditModal = (partner: Partner): void => {
        setPartnerToEdit(partner);
        setIsFormModalOpen(true);
    };
    const handleCloseFormModal = (): void => {
        setIsFormModalOpen(false);
        setPartnerToEdit(null);
    };

    const handleAddPartner = async (partnerData: NewPartner): Promise<void> => {
        const fullPartnerData = {
            ...partnerData,
            product_id: product.id,
        };

        const { data, error } = await supabase.from('partners').insert([fullPartnerData]).select().single();
        if (error) throw error;
        if (data) {
            const newPartner = mapSupabaseToPartner(data);
            setAllPartners(prev => [newPartner, ...prev]);
            handleCloseFormModal();
        }
    };

    const handleUpdatePartner = async (partnerData: NewPartner, partnerId: string): Promise<void> => {
        const { data, error } = await supabase.from('partners').update(partnerData).eq('id', partnerId).select().single();
        if (error) throw error;
        if (data) {
            const updatedPartner = mapSupabaseToPartner(data);
            setAllPartners(prev => prev.map(p => p.id === partnerId ? updatedPartner : p));
            handleCloseFormModal();
            if (selectedPartner?.id === partnerId) {
                setSelectedPartner(updatedPartner);
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-start mb-4">
                <div>
                     <a href="/products" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/products'); }} className="text-sm text-sky-600 hover:underline flex items-center mb-2">
                        <Icon name="arrow-right" className="w-4 h-4 mr-2 transform rotate-180" />
                        Back to All Products
                    </a>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                        <img src={product.icon_url} alt="" className="w-10 h-10 mr-4 rounded-lg" />
                        {product.name}
                    </h1>
                    <p className="text-slate-500 mt-1 ml-14">{product.description}</p>
                </div>
                 <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-sky-500 text-white rounded-lg text-base font-semibold hover:bg-sky-600 transition-all shadow-sm flex-shrink-0"
                 >
                    <Icon name="plus-circle" className="w-5 h-5" />
                    <span>Add New Partner</span>
                </button>
            </div>
            
            <div className="mb-8">
                <StatsSection items={productPartners} type="partners" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">All Partners ({productPartners.length})</h2>
                    <FilterControls
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                    />
                </div>
                <PartnerList partners={filteredPartners} onSelectPartner={handleSelectPartner} />
            </div>

            {selectedPartner && (
                <PartnerDetailModal 
                    partner={selectedPartner} 
                    onClose={handleCloseDetailModal}
                    onEdit={(partner) => {
                        handleCloseDetailModal();
                        handleOpenEditModal(partner);
                    }}
                />
            )}
            {isFormModalOpen && (
                <PartnerFormModal
                    partnerToEdit={partnerToEdit}
                    onClose={handleCloseFormModal}
                    onAddPartner={handleAddPartner}
                    onUpdatePartner={handleUpdatePartner}
                />
            )}
        </>
    );
};