
import React, { useState, useCallback } from 'react';
import type { Partner } from '../types';
import { StatusBadge } from './StatusBadge';
import { Icon } from './Icon';
import { generatePartnerSummary } from '../services/geminiService';

interface PartnerDetailModalProps {
    partner: Partner;
    onClose: () => void;
    onEdit: (partner: Partner) => void;
}

const DetailItem: React.FC<{ icon: React.ComponentProps<typeof Icon>['name']; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div>
        <dt className="flex items-center text-sm font-medium text-slate-500">
            <Icon name={icon} className="w-4 h-4 mr-2" />
            <span>{label}</span>
        </dt>
        <dd className="mt-1 text-sm text-slate-900">{children}</dd>
    </div>
);

const AILoadingSkeleton: React.FC = () => (
    <div className="space-y-2 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    </div>
);

export function ProductDetailModal({ partner, onClose, onEdit }: PartnerDetailModalProps): React.ReactNode {
    const [aiSummary, setAiSummary] = useState<string>('');
    const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);

    const handleGenerateSummary = useCallback(async () => {
        setIsLoadingSummary(true);
        setAiSummary('');
        try {
            const summary = await generatePartnerSummary(partner);
            setAiSummary(summary);
        } catch (error) {
            console.error(error);
            setAiSummary('Failed to generate summary.');
        } finally {
            setIsLoadingSummary(false);
        }
    }, [partner]);
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={onClose}>
            <div 
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 pb-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4 mb-6">
                            <img src={partner.logo_url} alt={`${partner.name} logo`} className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md" />
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800">{partner.name}</h2>
                                <div className="mt-1"><StatusBadge status={partner.status} /></div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                            <Icon name="x" className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>
                </div>
                
                <div className="p-8 pt-0 max-h-[80vh] overflow-y-auto">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                                <Icon name="sparkles" className="w-5 h-5 mr-2 text-sky-500" />
                                AI-Powered Summary
                            </h3>
                             <button 
                                onClick={handleGenerateSummary}
                                disabled={isLoadingSummary}
                                className="px-3 py-1.5 text-sm font-semibold text-sky-600 bg-sky-100 rounded-md hover:bg-sky-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                             >
                                <Icon name={isLoadingSummary ? "loader" : "refresh-cw"} className={`w-4 h-4 mr-2 ${isLoadingSummary ? 'animate-spin' : ''}`} />
                                {isLoadingSummary ? 'Generating...' : 'Regenerate'}
                            </button>
                        </div>
                        <div className="text-sm text-slate-600 leading-relaxed">
                            {isLoadingSummary ? <AILoadingSkeleton /> : (aiSummary || <p className="italic text-slate-500">Click "Regenerate" to create a partner summary.</p>)}
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                         <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <DetailItem icon="user" label="Contact Person">
                                {partner.contact_person.name} (<a href={`mailto:${partner.contact_person.email}`} className="text-sky-600 hover:underline">{partner.contact_person.email}</a>)
                            </DetailItem>
                             <DetailItem icon="calendar" label="Joined Date">
                                {new Date(partner.join_date).toLocaleDateString()}
                            </DetailItem>
                            <div className="md:col-span-2">
                                <DetailItem icon="file-text" label="Description">
                                   <p className="whitespace-pre-wrap font-mono text-xs bg-slate-50 p-3 rounded-md border border-slate-200">{partner.description}</p>
                                </DetailItem>
                            </div>
                        </dl>
                    </div>
                </div>
                 <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end">
                    <button
                        onClick={() => onEdit(partner)}
                        className="px-5 py-2.5 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center transition-colors"
                    >
                        <Icon name="pencil" className="w-4 h-4 mr-2" />
                        Edit Partner
                    </button>
                </div>
            </div>
        </div>
    );
}
