import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { useNavigate } from 'react-router-dom'; // 💡 Allows us to use shortcut buttons!

export default function Dashboard() {
  const { items, transactions } = useInventory();
  const navigate = useNavigate();

  // 1. Calculations
  const totalValue = items.reduce((acc, item) => acc + (item.price * item.stock), 0);
  const totalSkuCount = items.length;
  
  const lowStockList = items.filter(item => item.stock < 5);
  const criticalItemsCount = lowStockList.length;

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentActivity = transactions.filter(t => new Date(t.timestamp) > oneDayAgo).length;
  const recentFeed = transactions.slice(0, 5);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">System Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Central command for stock monitoring, audit ledgers, and valuation metrics.</p>
        </div>
        

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Live Sync Active</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            <span className="text-xs font-medium text-slate-600 font-mono">SKUs Managed: {totalSkuCount}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inventory Worth */}
        <div className="group relative p-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Valuation</p>
          <p className="text-3xl font-black text-slate-900 mt-2 font-mono">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-2">Aggregated asset worth based on list pricing</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="group relative p-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className={`absolute top-0 left-0 w-1.5 h-full ${criticalItemsCount > 0 ? 'bg-rose-500' : 'bg-slate-300'}`} />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Stock Alerts</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className={`text-3xl font-black ${criticalItemsCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {criticalItemsCount}
            </p>
            <span className="text-sm text-slate-400 font-medium">items reorder status</span>
          </div>
          
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${criticalItemsCount > 0 ? 'bg-rose-500' : 'bg-slate-400'}`} 
              style={{ width: `${Math.min((criticalItemsCount / (totalSkuCount || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        
        <div className="group relative p-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity (Rolling 24h)</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{recentActivity}</p>
          <p className="text-xs text-slate-400 mt-2">Transactions successfully logged today</p>
        </div>
      </div>

      {/*QUICK ACTIO*/}
      <div className="p-4  bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
        <div className="sm:pl-2">
          <p className="text-sm font-bold">Fast-Track Administration</p>
          <p className="text-xs text-slate-400">Execute quick operations updates or audit evaluations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
          >
            View Spreadsheet
          </button>
          <button 
            onClick={() => navigate('/operations')}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-md shadow-blue-900/20"
          >
            + Dispatch New Stock
          </button>
        </div>
      </div>

      {/*BOTTOM STYLING*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
              🚨 Deficit Monitoring
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">Action Needed</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-70 space-y-2.5 pr-1">
            {lowStockList.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                🎉 Excellent. All stock items report levels exceeding the safety limits.
              </div>
            ) : (
              lowStockList.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3.5 bg-rose-50/30 hover:bg-rose-50/60 border border-rose-100 rounded-xl transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs font-mono text-slate-400">SKU: {String(item.id).padStart(4, '0')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 inline-block border border-rose-200 shadow-sm">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL B: RECENT LOG FEED */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
              ⚡ Real-time Audit Ticker
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">System Logs</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-70 divide-y divide-slate-100 pr-1">
            {recentFeed.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                No ledger activity logged within the active cycle session.
              </div>
            ) : (
              recentFeed.map(log => (
                <div key={log.id} className="py-3.5 flex justify-between items-center gap-4 first:pt-0 last:pb-0 group">
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{log.itemName}</p>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{log.reason}</p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                      log.change.startsWith('+') 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {log.change}
                    </span>
                    <p className="text-[10px] font-mono text-slate-400 font-semibold">{log.timestamp.split(', ')[1] || log.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}