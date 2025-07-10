import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import type { NewInsuranceProduct, InsuranceCategory, InsuranceProduct } from '../types';
import { InsuranceProductStatus } from '../types';

interface ProductFormModalProps {
    onClose: () => void;
    onAddProduct: (product: NewInsuranceProduct) => Promise<void>;
    onUpdateProduct: (product: NewInsuranceProduct, id: string) => Promise<void>;
    productToEdit: InsuranceProduct | null;
}

const InputField: React.FC<{ id: string; label: string; children: React.ReactNode }> = ({ id, label, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children}
    </div>
);

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ onClose, onAddProduct, onUpdateProduct, productToEdit }) => {
    const isEditMode = !!productToEdit;

    const [formData, setFormData] = useState<NewInsuranceProduct>({
        name: '',
        iconUrl: 'https://i.imgur.com/g892g4S.png', // Default icon
        status: InsuranceProductStatus.InReview,
        category: 'Motor',
        policyCode: '',
        description: '',
        keyFeatures: [],
    });
    const [keyFeaturesInput, setKeyFeaturesInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: productToEdit.name,
                iconUrl: productToEdit.iconUrl,
                status: productToEdit.status,
                category: productToEdit.category,
                policyCode: productToEdit.policyCode,
                description: productToEdit.description,
                keyFeatures: productToEdit.keyFeatures,
            });
            setKeyFeaturesInput(productToEdit.keyFeatures.join(', '));
        }
    }, [productToEdit, isEditMode]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const productData: NewInsuranceProduct = {
            ...formData,
            keyFeatures: keyFeaturesInput.split(',').map(f => f.trim()).filter(Boolean),
        };

        try {
            if (isEditMode) {
                await onUpdateProduct(productData, productToEdit.id);
            } else {
                await onAddProduct(productData);
            }
        } catch (err) {
            const apiError = err as Error;
            setError(apiError.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={onClose}>
            <div 
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {isEditMode ? 'Edit Insurance Policy' : 'Add New Insurance Policy'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <Icon name="x" className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <InputField id="name" label="Policy Name">
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </InputField>
                            </div>
                            <InputField id="status" label="Status">
                                <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                                    {Object.values(InsuranceProductStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </InputField>
                            <InputField id="category" label="Category">
                                 <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                                    {(['Motor', 'Medical', 'Marine', 'Pet'] as InsuranceCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
                                 </select>
                            </InputField>
                            <InputField id="policyCode" label="Policy Code">
                                <input type="text" id="policyCode" name="policyCode" value={formData.policyCode} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </InputField>
                             <InputField id="iconUrl" label="Icon URL">
                                <input type="text" id="iconUrl" name="iconUrl" value={formData.iconUrl} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </InputField>
                            <div className="md:col-span-2">
                                <InputField id="description" label="Description">
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                                </InputField>
                            </div>
                            <div className="md:col-span-2">
                                <InputField id="keyFeaturesInput" label="Key Features (comma-separated)">
                                    <input type="text" id="keyFeaturesInput" name="keyFeaturesInput" value={keyFeaturesInput} onChange={(e) => setKeyFeaturesInput(e.target.value)} placeholder="e.g. 24/7 Support, Theft Protection" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </InputField>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end items-center space-x-4">
                        {error && <p className="text-sm text-red-600 flex-1">{error}</p>}
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:opacity-50 flex items-center">
                           <Icon name={loading ? 'loader' : (isEditMode ? 'check-circle' : 'plus')} className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                           {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Policy')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};