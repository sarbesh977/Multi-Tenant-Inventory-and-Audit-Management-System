import React, { createContext, useState, useContext, useEffect } from 'react';

export const InventoryContext = createContext();

const API_BASE_URL = 'http://localhost:5001/api/inventory';

export const InventoryState = ({ children }) => {
    const [items, setItems] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const fetchInventoryData = async () => {
        try {
            const itemResponse = await fetch(`${API_BASE_URL}/`);
            if (itemResponse.ok) {
                const itemData = await itemResponse.json();
                setItems(itemData);
            }
            const auditResponse = await fetch(`${API_BASE_URL}/audit-history`);
            if (auditResponse.ok) {
                const auditData = await auditResponse.json();
                setTransactions(auditData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const addItem = async (newItem) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You must be logged in to create new records.");
                return { success: false };
            }

            const response = await fetch(`${API_BASE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newItem)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            await fetchInventoryData();
            return { success: true };
        } catch (error) {
            console.error(error);
            alert(`Failed to add item: ${error.message}`);
            return { success: false };
        }
    };

    const handleAdjustment = async (id, amount, reason) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Security Error: You must be logged in to adjust inventory metrics.");
                return { success: false };
            }
            const response = await fetch(`${API_BASE_URL}/update-stock/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount, reason })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update stock on the server.");
            }
            
            await fetchInventoryData();
            return { success: true };
        } catch (error) {
            console.error(error);
            alert(`Adjustment failed: ${error.message}`);
            return { success: false };
        }
    };

    return (
        <InventoryContext.Provider value={{ items, transactions, addItem, handleAdjustment }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => useContext(InventoryContext);