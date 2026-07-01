import React, {createContext, useState, useContext} from 'react';
export const InventoryContext= createContext();

export const InventoryState= ({children})=>{
    const [items, setItems]= useState([
        { id: 1, name: "Hammer", category: "Tools", stock: 10, price: 15.99 },
        { id: 2, name: "Steel Bolts", category: "Hardware", stock: 100, price: 0.50 }
    ]);

    const [transactions, setTransactions]= useState([]);

    const addItem= (newItem)=>{
 
        const itemWithId={...newItem, id:Date.now()};
        setItems(prevItems=>[...prevItems, itemWithId]);

        

        const initialLog={
            id: Date.now() + 1,
            itemName: newItem.name,
            change: `+${newItem.stock}`,
            type: "INITIAL_ENTRY",
            reason: "First stock entry",
            timestamp: new Date().toLocaleString()
        };
        setTransactions(prevLogs=>[initialLog, ...prevLogs])
    };

    const handleAdjustment= (id,amount, reason)=>{

        const itemToUpdate = items.find(item => item.id === id);
        if (!itemToUpdate) return;

        setItems(prevItems=>prevItems.map(item=>{
            if(item.id===id){
                return{...item, stock: item.stock+amount};
            }
            return item;
        }));

        const newLog={
            id:Date.now(),
            itemName: itemToUpdate.name,
            change: amount>0 ? `+${amount}`: `${amount}`,
            type: amount>0 ? "RESTOCK" : "REDUCTION",
            reason: reason || (amount > 0 ? "Manual Increase" : "Manual Decrease"),
            timestamp: new Date().toLocaleString()
        };
        setTransactions(prevLogs=>[newLog, ...prevLogs]);
    };
    return(
        <InventoryContext.Provider value={{items, transactions, addItem, handleAdjustment}}>
            {children}
        </InventoryContext.Provider>
    );
    };

    export const useInventory=()=>useContext(InventoryContext);
