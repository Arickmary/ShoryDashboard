
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { supabase, supabaseError } from './services/supabaseClient';
import type { Product, Partner, NewPartner } from './types';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { Icon } from './components/Icon';
import { AuthPage } from './components/AuthPage';
import type { Session } from '@supabase/supabase-js';
import { ProductDetailPage } from './components/ProductDetailPage';

const LoadingScreen: React.FC = () => (
    <div className="flex min-h-screen bg-slate-100/50 items-center justify-center">
        <div className="flex items-center space-x-3">
            <Icon name="loader" className="w-8 h-8 text-sky-500 animate-spin" />
            <p className="text-xl text-slate-600 font-semibold">Loading Product Hub...</p>
        </div>
    </div>
);

const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
     <div className="flex min-h-screen bg-slate-100/50 items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <Icon name="alert-triangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
            <p className="text-slate-500 mt-2 max-w-md">{message}</p>
            <p className="text-xs text-slate-400 mt-4">Please check the configuration script in your index.html file and your Supabase table setup.</p>
        </div>
    </div>
);

export default function App(): React.ReactNode {
    const [session, setSession] = useState<Session | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [allPartners, setAllPartners] = useState<Partner[]>([]);
    
    const [activeView, setActiveView] = useState(window.location.pathname);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleLocationChange = () => setActiveView(window.location.pathname);
        window.addEventListener('popstate', handleLocationChange);
        // Custom event for pushState
        const originalPushState = window.history.pushState;
        window.history.pushState = function(...args) {
            originalPushState.apply(this, args);
            window.dispatchEvent(new Event('popstate'));
        };
        
        return () => {
             window.removeEventListener('popstate', handleLocationChange);
             window.history.pushState = originalPushState;
        }
    }, []);

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
        if (!session) return; 

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            const productsPromise = supabase.from('products').select('*');
            const partnersPromise = supabase.from('partners').select('*');

            const [{ data: productsData, error: productsError }, { data: partnersData, error: partnersError }] = await Promise.all([productsPromise, partnersPromise]);

            if (productsError) {
                console.error('Error fetching products:', productsError);
                setError(`Failed to fetch products. (Reason: ${productsError.message})`);
            } else if (productsData) {
                setProducts(productsData as Product[]);
            }

            if (partnersError) {
                console.error('Error fetching partners:', partnersError);
                setError(`Failed to fetch partners. (Reason: ${partnersError.message})`);
            } else if (partnersData) {
                setAllPartners(partnersData as Partner[]);
            }

            setLoading(false);
        };

        fetchData();
    }, [session]);
    
    const handleSignOut = async () => {
        if(supabase) {
            await supabase.auth.signOut();
            window.location.href = '/'; // Go to login page after signout
        }
    }

    const renderContent = () => {
        if (loading && !session) return <LoadingScreen />;
        if (error) return <ErrorScreen message={error} />;
        if (!session) return <AuthPage />;

        if (loading && products.length === 0) return <LoadingScreen />;
        
        const path = activeView;

        if (path.startsWith('/products/')) {
            const productId = path.split('/')[2];
            const product = products.find(p => p.id === productId);
            if(product) {
                return <ProductDetailPage product={product} allPartners={allPartners} setAllPartners={setAllPartners} session={session} />;
            } else if (!loading) {
                 return <ErrorScreen message="Product not found." />;
            } else {
                 return <LoadingScreen />;
            }
        }

        if (path === '/products') {
            return <ProductsView products={products} partners={allPartners} />;
        }
        
        if (path === '/dashboard' || path === '/') {
            return <DashboardView products={products} partners={allPartners} />;
        }
        
        return (
             <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-400 capitalize">{path.replace('/', '') || 'Page'}</h1>
                    <p className="mt-2 text-slate-500">This page is under construction.</p>
                </div>
            </div>
        );
    };


    if (loading && !session) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} />;
    if (!session) return <AuthPage />;

    return (
        <div className="flex min-h-screen bg-slate-100/50 text-slate-800">
            <Sidebar activePath={activeView} session={session} onSignOut={handleSignOut} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
}
