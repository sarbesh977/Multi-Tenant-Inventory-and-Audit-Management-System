import React, {useState} from 'react';

export default function AddItemModal({isOpen, onClose, onAdd}){
    const categories = ["Hardware", "Electrical", "Plumbing", "Safety", "Tools"];
    const [formData, setFormData]= useState(
        {
            name:'',
            category:'',
            stock:'',
            price:''
        });
    
    if(!isOpen) return null;
    const handleSubmit= (e)=>{
        e.preventDefault();

        onAdd(
            {
                name: formData.name,
                category: formData.category,
                stock: parseInt(formData.stock)||0,
                price: parseFloat(formData.price) || 0
            });
        setFormData({
             name:'',
            category:'',
            stock:'',
            price:''
        });    
    };

    return(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Item</h2>
          <p className="text-sm text-slate-500">Enter details to update the inventory list.</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Item Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Steel Bolts"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
            <select 
              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Stock Quantity</label>
            <input 
              required
              type="number" 
              placeholder="0"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>
            <div>
  <label className="block text-sm font-semibold text-slate-700 mb-1">Price ($)</label>
  <input 
    required
    type="number" 
    step="0.01" 
    placeholder="0.00"
    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
    value={formData.price}
    onChange={(e) => setFormData({...formData, price: e.target.value})}
  />
</div>
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
            >
              Save to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
    );
}