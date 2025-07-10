import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Icon } from './Icon';

export const AuthPage: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage('Success! Please check your email for a confirmation link to complete your registration.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                // No message needed for sign-in, the app will redirect automatically on success
            }
        } catch (error) {
            const err = error as Error;
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-sky-500 p-3 rounded-lg">
                    <Icon name="zap" className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800">Insurance Hub</h1>
            </div>

            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="text-center text-slate-500 mb-6">{isSignUp ? 'Get started with your free account' : 'Sign in to continue'}</p>

                <form onSubmit={handleAuthAction} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                             className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {loading ? <Icon name="loader" className="w-6 h-6 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                {error && <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
                {message && <div className="mt-4 text-center text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">{message}</div>}


                <p className="text-center text-sm text-slate-500 mt-6">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }} className="font-semibold text-sky-600 hover:underline ml-1">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
             <p className="text-xs text-slate-400 mt-8">By signing up, you agree to our Terms of Service.</p>
        </div>
    );
};
