import React, {createContext, useState, useContext} from 'react';
<<<<<<< HEAD
import { useEffect } from 'react';
export const InventoryContext= createContext();

const API_BASE_URL= 'http://localhost:5001/api/inventory';

export const InventoryState= ({children})=>{
    const [items, setItems]= useState([]);
    const [transactions, setTransactions]= useState([]);

    const fetchInventoryData= async ()=>{
        try{
            const itemResponse= await fetch(`${API_BASE_URL}/`);
            if(itemResponse.ok){
                const itemData= await itemResponse.json();
                setItems(itemData);
            }
            const auditResponse= await fetch(`${API_BASE_URL}/audit-history`);
            if(auditResponse.ok) {
                const auditData= await auditResponse.json();
                setTransactions(auditData);
            }
        } catch(error){
            console.error(error);
        }
    };
    useEffect(()=>{
        fetchInventoryData();
    },[]);

    const addItem= async (newItem)=>{
        try{
            const token= localStorage.getItem('token');
            if (!token) return alert("You must be logged in to create new records.");

            const response= await fetch(`${API_BASE_URL}/add`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            });
            const data= await response.json();
            if(!response.ok) throw new Error(data.message);

            await fetchInventoryData();
            return{success:true};
        } catch(error){
            console.error(error);
            alert(`Failed to add item: ${error.message}`);
            return { success: false };
        }
    };

    const handleAdjustment= (id,amount, reason)=>{
try{
    const token= localStorage.getItem('token');
    if(!token){
        alert("Security Error: You must be logged in to adjust inventory metrics.");
        return { success: false };
    }
    const response= await fetch(`${API_BASE_URL}/update-stock/${id}`, {
        method: PUT,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({amount, reason})
    });
    const data= await response.json();
    if(!response.ok){
        throw new Error(data.message|| "Failed to update stock on the server.");
    }
    setItems(prevItems=> prevItems.map(item=>{
        if(item.id===id){
            return {...item, quantity: item.quantity+amount};
        }
        return item;
        }));
        await fetchInventoryData();
        return {success:true};
    }
    catch(error){
        console.error(error);
        alert(`Adjustment failed: ${error.message}`);
        return { success: false };
    }
    
}
        
=======
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
>>>>>>> 03c7d6d6792d71860ce60440864fcc1e15927d61
    return(
        <InventoryContext.Provider value={{items, transactions, addItem, handleAdjustment}}>
            {children}
        </InventoryContext.Provider>
    );
<<<<<<< HEAD
};

export const useInventory=()=>useContext(InventoryContext);
=======
    };

    export const useInventory=()=>useContext(InventoryContext);
>>>>>>> 03c7d6d6792d71860ce60440864fcc1e15927d61
