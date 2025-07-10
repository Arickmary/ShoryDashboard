import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { supabase, supabaseError } from './services/supabaseClient';
import type { InsuranceProduct, NewInsuranceProduct } from './types';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { Icon } from './components/Icon';
import { AuthPage } from './components/AuthPage';
import type { Session } from '@supabase/supabase-js';
import { ProductFormModal } from './components/ProductFormModal';

export type ViewType = 'dashboard' | 'products' | 'reports' | 'settings';

const LoadingScreen: React.FC = () => (
    <div className="flex min-h-screen bg-slate-100/50 items-center justify-center">
        <div className="flex items-center space-x-3">
            <Icon name="loader" className="w-8 h-8 text-sky-500 animate-spin" />
            <p className="text-xl text-slate-600 font-semibold">Loading Insurance Hub...</p>
        </div>
    </div>
);

const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
     <div className="flex min-h-screen bg-slate-100/50 items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <Icon name="alert-triangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
            <p className="text-slate-500 mt-2 max-w-md">{message}</p>
            <p className="text-xs text-slate-400 mt-4">Please check the configuration script in your index.html file.</p>
        </div>
    </div>
);

// Helper function to map Supabase data to our application's product type
const mapSupabaseToProduct = (p: any): InsuranceProduct => ({
    id: p.id,
    name: p.name,
    iconUrl: p.icon_url,
    status: p.status,
    underwriter: p.underwriter,
    lastUpdate: p.last_update,
    category: p.category,
    policyCode: p.policy_code,
    description: p.description,
    keyFeatures: p.key_features,
});


export default function App(): React.ReactNode {
    const [session, setSession] = useState<Session | null>(null);
    const [products, setProducts] = useState<InsuranceProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const [productToEdit, setProductToEdit] = useState<InsuranceProduct | null>(null);
    const [activeView, setActiveView] = useState<ViewType>('dashboard');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (supabaseError) {
            setError(supabaseError);
            setLoading(false);
            return;
        }
        if (!supabase) {
            setError("Supabase client failed to initialize.");
            setLoading(false);
            return;
        }

        const getSession = async () => {
             const { data: { session } } = await supabase.auth.getSession();
             setSession(session);
             setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

     useEffect(() => {
        if (!session) return; // Don't fetch if not logged in

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('last_update', { ascending: false });

            if (error) {
                console.error('Error fetching products:', error);
                setError(`Failed to fetch insurance policies. Check your database permissions (RLS) and network connection. (Reason: ${error.message})`);
            } else if (data) {
                const mappedProducts: InsuranceProduct[] = data.map(mapSupabaseToProduct);
                setProducts(mappedProducts);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [session]);

    const handleSelectProduct = (product: InsuranceProduct): void => {
        setSelectedProduct(product);
    };

    const handleCloseDetailModal = (): void => {
        setSelectedProduct(null);
    };

    const handleOpenAddModal = (): void => {
        setProductToEdit(null);
        setIsFormModalOpen(true);
    };
    
    const handleOpenEditModal = (product: InsuranceProduct): void => {
        setProductToEdit(product);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = (): void => {
        setIsFormModalOpen(false);
        setProductToEdit(null);
    };

    const handleAddProduct = async (productData: NewInsuranceProduct): Promise<void> => {
        if (!supabase || !session) throw new Error("Not authenticated");

        const fullProductData = {
            ...productData,
            underwriter: {
                name: session.user.email?.split('@')[0] || 'N/A',
                email: session.user.email || 'N/A',
            },
            last_update: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('products')
            .insert([fullProductData])
            .select()
            .single(); // get the newly created row back

        if (error) {
            console.error('Error adding product:', error);
            throw error; // Let the modal handle the error display
        }

        if (data) {
            const newProduct = mapSupabaseToProduct(data);
            setProducts(prev => [newProduct, ...prev]);
            handleCloseFormModal();
        }
    };
    
    const handleUpdateProduct = async (productData: NewInsuranceProduct, productId: string): Promise<void> => {
        if (!supabase || !session) throw new Error("Not authenticated");
         const updatedFields = {
            ...productData,
            last_update: new Date().toISOString(),
        };
        const { data, error } = await supabase
            .from('products')
            .update(updatedFields)
            .eq('id', productId)
            .select()
            .single();

        if (error) {
            console.error('Error updating product:', error);
            throw error;
        }

        if (data) {
            const updatedProduct = mapSupabaseToProduct(data);
            setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
            handleCloseFormModal();
            // Also update the selected product if it's being viewed
            if (selectedProduct?.id === productId) {
                setSelectedProduct(updatedProduct);
            }
        }
    };
    
    const handleNavigate = (view: ViewType): void => {
        setActiveView(view);
    }

    const handleSignOut = async () => {
        if(supabase) {
            await supabase.auth.signOut();
        }
    }

    if (loading && !session) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    if (!session) {
        return <AuthPage />;
    }

    return (
        <div className="flex min-h-screen bg-slate-100/50 text-slate-800">
            <Sidebar activeView={activeView} onNavigate={handleNavigate} session={session} onSignOut={handleSignOut} />

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {loading && products.length === 0 ? <LoadingScreen /> : (
                    <>
                        {activeView === 'dashboard' && <DashboardView products={products} onOpenAddModal={handleOpenAddModal} />}
                        {activeView === 'products' && <ProductsView products={products} onSelectProduct={handleSelectProduct} />}
                        {(activeView === 'reports' || activeView === 'settings') && (
                             <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <h1 className="text-4xl font-bold text-slate-400 capitalize">{activeView}</h1>
                                    <p className="mt-2 text-slate-500">This page is under construction.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {selectedProduct && (
                <ProductDetailModal 
                    product={selectedProduct} 
                    onClose={handleCloseDetailModal}
                    onEdit={(product) => {
                        handleCloseDetailModal();
                        handleOpenEditModal(product);
                    }}
                />
            )}
            {isFormModalOpen && (
                <ProductFormModal
                    productToEdit={productToEdit}
                    onClose={handleCloseFormModal}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                />
            )}
        </div>
    );
}