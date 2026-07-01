import React, {useState} from 'react';
import { useInventory } from '../context/InventoryContext';

export default function Operations(){
    const {items, handleAdjustment}= useInventory();

    const [selectedItemId, setSelectedItemId]= useState('');
    const [amount, setAmount]= useState(1);
    const [type, setType]= useState('in');
    const [note, setNote]= useState('');

    const selectedItem= items.find(item=>item.id=== Number(selectedItemId));

    const handleSubmit=(e)=>{
        e.preventDefault();
      if (!selectedItemId){
        alert("Please select an item first.");
        return;
      }  
    const movement= type=='in'? parseInt(amount) : -parseInt(amount);

    if (type === 'out' && Math.abs(movement) > selectedItem.stock) {
      alert(`Error: You only have ${selectedItem.stock} units in stock.`);
      return;
    }
    const reason = `${type === 'in' ? 'Restock' : 'Sale'}: ${note || 'No reference provided'}`;
    handleAdjustment(Number(selectedItemId), movement, reason);
    setAmount(1);
    setNote('');
    alert("Transaction completed and logged to Audit!");
};
    return(
     <div>    
        <div className="p-8 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-6 text-slate-800">Warehouse Operations</h1>
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-6">

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Target Item</label>
            <select 
            className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
          >
            <option value="">-- Choose an Item from Inventory --</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>

          {selectedItem && (
            <div className="mt-3 flex items-center gap-2 animate-fadeIn">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Current Balance:</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                selectedItem.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {selectedItem.stock} units
              </span>
            </div>
          )}
        </div>

        {/*Quantity adn Notes */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
            <input type="number" min="1" value={amount} onChange={(e)=>setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>        
    
    <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Reference / Note</label>
            <input 
              type="text"
              placeholder="e.g. Invoice #99 or Damaged Goods"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
<button 
  type="button"
  onClick={() => setType('in')} 
  className={`border p-2 rounded-md ${type === 'in' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium' : 'bg-slate-50 border-slate-200'}`}
>
  Stock In
</button>

<button 
  type="button"
  onClick={() => setType('out')} 
  className={`border p-2 rounded-md ${type === 'out' ? 'bg-red-50 border-red-500 text-red-700 font-medium' : 'bg-slate-50 border-slate-200'}`}
>
  Stock Out
</button>

<button
    type="submit"
    className="w-full bg-slate-800 text-white p-4 rounded-lg font-bold hover:bg-slate-900 transition-colors"
>
    Process Transaction
    </button>
    </form>
        </div>
    </div>
    );
}