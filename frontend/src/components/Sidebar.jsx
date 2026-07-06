import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    {  label: 'Dashboard', path: '/dashboard' },
    {  label: 'Inventory', path: '/inventory' },
    {  label: 'Operations', path: '/operations' }, 
    {  label: 'Audits', path: '/audits' },
    {  label: 'Users', path: '/users' },
    {  label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
      
      <div className="p-6 text-white font-bold text-2xl border-b border-slate-800">
        Inv<span className="text-emerald-500">Audit</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.label} 
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Created by <span className="text-slate-300 font-semibold">Sarbesh</span> © 2026
      </div>
    </div>
  );
}