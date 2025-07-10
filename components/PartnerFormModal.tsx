import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import type { NewPartner, Partner } from '../types';
import { PartnerStatus } from '../types';

interface PartnerFormModalProps {
    onClose: () => void;
    onAddPartner: (partner: NewPartner) => Promise<void>;
    onUpdatePartner: (partner: NewPartner, id: string) => Promise<void>;
    partnerToEdit: Partner | null;
}

const InputField: React.FC<{ id: string; label: string; children: React.ReactNode }> = ({ id, label, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children}
    </div>
);

export const PartnerFormModal: React.FC<PartnerFormModalProps> = ({ onClose, onAddPartner, onUpdatePartner, partnerToEdit }) => {
    const isEditMode = !!partnerToEdit;

    const [formData, setFormData] = useState({
        name: '',
        logo_url: 'https://i.imgur.com/sC22L2A.png', // Default logo
        status: PartnerStatus.Onboarding,
        join_date: new Date().toISOString().split('T')[0],
        contact_person_name: '',
        contact_person_email: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && partnerToEdit) {
            setFormData({
                name: partnerToEdit.name,
                logo_url: partnerToEdit.logo_url,
                status: partnerToEdit.status,
                join_date: new Date(partnerToEdit.join_date).toISOString().split('T')[0],
                contact_person_name: partnerToEdit.contact_person.name,
                contact_person_email: partnerToEdit.contact_person.email,
                description: partnerToEdit.description,
            });
        }
    }, [partnerToEdit, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const partnerData: NewPartner = {
            name: formData.name,
            logo_url: formData.logo_url,
            status: formData.status,
            join_date: new Date(formData.join_date).toISOString(),
            contact_person: {
                name: formData.contact_person_name,
                email: formData.contact_person_email,
            },
            description: formData.description,
        };

        try {
            if (isEditMode && partnerToEdit) {
                await onUpdatePartner(partnerData, partnerToEdit.id);
            } else {
                await onAddPartner(partnerData);
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
                        {isEditMode ? 'Edit Partner' : 'Add New Partner'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <Icon name="x" className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <InputField id="name" label="Partner Name">
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                                </InputField>
                            </div>
                            <InputField id="status" label="Status">
                                <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                                    {Object.values(PartnerStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </InputField>
                             <InputField id="logo_url" label="Logo URL">
                                <input type="text" id="logo_url" name="logo_url" value={formData.logo_url} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </InputField>
                            <InputField id="contact_person_name" label="Contact Name">
                                <input type="text" id="contact_person_name" name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </InputField>
                            <InputField id="contact_person_email" label="Contact Email">
                                <input type="email" id="contact_person_email" name="contact_person_email" value={formData.contact_person_email} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </InputField>
                            <div className="md:col-span-2">
                                <InputField id="description" label="Description">
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                                </InputField>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end items-center space-x-4">
                        {error && <p className="text-sm text-red-600 flex-1">{error}</p>}
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:opacity-50 flex items-center">
                           <Icon name={loading ? 'loader' : (isEditMode ? 'check-circle' : 'plus')} className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                           {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Partner')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};