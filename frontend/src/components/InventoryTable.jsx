import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import AddItemModal from './AddItemModal'; 

export default function InventoryTable() {
  const { items, addItem } = useInventory(); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleAddNewItem = async (newItemData) => {
    const payload = {
      item_name: newItemData.name,
      category: newItemData.category || 'Hardware',
      quantity: newItemData.stock,
      price: newItemData.price
    };

    try {
      if (addItem) {
        await addItem(payload);
      } else {
        console.warn("addItem function is missing inside your InventoryContext.jsx!");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to commit item creation workflow:", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory Stock</h1>
          <p className="text-slate-500 text-sm">Real-time view of warehouse levels</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-md transition-all duration-150"
          >
            + Add New Product
          </button>
          
          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-semibold text-sm">
            Total SKUs: {items.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-600 text-sm">Item ID</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Item Name</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Category</th>
              <th className="p-4 font-semibold text-slate-600 text-sm text-center">Stock Level</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm font-mono text-slate-500">{item.id}</td>
                <td className="p-4 text-sm font-bold text-slate-800">{item.name}</td>
                <td className="p-4 text-sm">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="p-4 text-sm text-center">
                  <span className={`font-bold ${item.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                    {item.stock}
                  </span>
                </td>
                <td className="p-4">
                  {item.stock < 10 ? (
                    <span className="flex items-center gap-1.5 text-red-600 text-xs font-bold uppercase">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      Low Stock
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Healthy
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {items.length === 0 && (
          <div className="p-10 text-center text-slate-400">
            No items found in inventory.
          </div>
        )}
      </div>

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddNewItem} 
      />
    </div>
  );
}