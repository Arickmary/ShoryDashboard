import React, { useState, useCallback } from 'react';
import type { InsuranceProduct } from '../types';
import { StatusBadge } from './StatusBadge';
import { Icon } from './Icon';
import { generateInsuranceProductSummary } from '../services/geminiService';

interface ProductDetailModalProps {
    product: InsuranceProduct;
    onClose: () => void;
}

const DetailItem: React.FC<{ icon: string; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div>
        <dt className="flex items-center text-sm font-medium text-slate-500">
            <Icon name={icon as any} className="w-4 h-4 mr-2" />
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

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps): React.ReactNode {
    const [aiSummary, setAiSummary] = useState<string>('');
    const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);

    const handleGenerateSummary = useCallback(async () => {
        setIsLoadingSummary(true);
        setAiSummary('');
        try {
            const summary = await generateInsuranceProductSummary(product);
            setAiSummary(summary);
        } catch (error) {
            console.error(error);
            setAiSummary('Failed to generate summary.');
        } finally {
            setIsLoadingSummary(false);
        }
    }, [product]);
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={onClose}>
            <div 
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <Icon name="x" className="w-6 h-6 text-slate-500" />
                </button>
                
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                        <img src={product.iconUrl} alt={`${product.name} icon`} className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md" />
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800">{product.name}</h2>
                            <div className="mt-1"><StatusBadge status={product.status} /></div>
                        </div>
                    </div>

                    {/* AI Summary Section */}
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
                            {isLoadingSummary ? <AILoadingSkeleton /> : (aiSummary || <p className="italic text-slate-500">Click "Regenerate" to create a policy summary.</p>)}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="border-t border-slate-200 pt-6">
                         <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <DetailItem icon="user" label="Underwriter">
                                {product.underwriter.name} (<a href={`mailto:${product.underwriter.email}`} className="text-sky-600 hover:underline">{product.underwriter.email}</a>)
                            </DetailItem>
                             <DetailItem icon="calendar" label="Last Update">
                                {new Date(product.lastUpdate).toLocaleString()}
                            </DetailItem>
                             <DetailItem icon="tag" label="Category">
                                {product.category}
                            </DetailItem>
                            <DetailItem icon="git-branch" label="Policy Code">
                                {product.policyCode}
                            </DetailItem>
                            <div className="md:col-span-2">
                                <DetailItem icon="file-text" label="Description">
                                   <p className="whitespace-pre-wrap font-mono text-xs bg-slate-50 p-3 rounded-md border border-slate-200">{product.description}</p>
                                </DetailItem>
                            </div>
                            <div className="md:col-span-2">
                                <DetailItem icon="check-circle" label="Key Features">
                                   <ul className="list-disc list-inside space-y-1 mt-1">
                                    {product.keyFeatures.map(feature => <li key={feature}>{feature}</li>)}
                                   </ul>
                                </DetailItem>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}