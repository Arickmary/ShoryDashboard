import React from 'react';
import { Icon } from './Icon';
import type { ViewType } from '../App';
import type { Session } from '@supabase/supabase-js';

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ComponentProps<typeof Icon>['name'], label: string, active?: boolean, onClick: () => void }) => {
    const activeClasses = active ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-400';
    return (
        <li>
            <button onClick={onClick} className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${activeClasses}`}>
                <Icon name={icon} className="w-6 h-6 mr-3" />
                <span className="font-medium">{label}</span>
            </button>
        </li>
    );
};

interface SidebarProps {
    activeView: ViewType;
    onNavigate: (view: ViewType) => void;
    session: Session;
    onSignOut: () => void;
}


export function Sidebar({ activeView, onNavigate, session, onSignOut }: SidebarProps): React.ReactNode {
    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col p-4">
            <div className="flex items-center space-x-3 p-2 mb-4">
                <div className="bg-sky-500 p-2 rounded-lg">
                   <Icon name="zap" className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Insurance Hub</h1>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    <NavItem icon="layout-dashboard" label="Dashboard" active={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
                    <NavItem icon="shield" label="Policies" active={activeView === 'products'} onClick={() => onNavigate('products')} />
                    <NavItem icon="file-text" label="Reports" active={activeView === 'reports'} onClick={() => onNavigate('reports')} />
                    <NavItem icon="settings" label="Settings" active={activeView === 'settings'} onClick={() => onNavigate('settings')} />
                </ul>
            </nav>

            <div className="mt-4 border-t border-slate-700 pt-4">
                 <div className="flex items-center space-x-3 p-2">
                    <img 
                        src={`https://api.dicebear.com/8.x/initials/svg?seed=${session.user.email}`}
                        alt="User avatar" 
                        className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate" title={session.user.email}>{session.user.email}</p>
                        <button onClick={onSignOut} className="text-sm text-sky-400 hover:underline flex items-center">
                            <Icon name="log-out" className="w-4 h-4 mr-1" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}