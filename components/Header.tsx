
import React from 'react';
import { Icon } from './Icon';

export function Header(): React.ReactNode {
    return (
        <header className="bg-white shadow-sm border-b border-slate-200">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-slate-800 p-2 rounded-lg">
                           <Icon name="zap" className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">Partner Integrations</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                           <Icon name="bell" className="w-6 h-6 text-slate-500" />
                        </button>
                        <img 
                            src="https://picsum.photos/seed/user/40/40" 
                            alt="User avatar" 
                            className="w-10 h-10 rounded-full border-2 border-slate-200"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
