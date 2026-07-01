import React, { useState } from 'react';
import AddItemModal from '../components/AddItemModal';
import { useInventory } from '../context/InventoryContext';
import InventoryTable from '../components/InventoryTable'; 

export default function Inventory() {
  const {items, addItem}= useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItem = (newItem) => {
    addItem(newItem);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
          + Add Item
        </button>
      </div>

     
      <InventoryTable items={items} />

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddItem} 
      />
    </div>
  );
}