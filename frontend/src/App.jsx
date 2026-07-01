import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import { InventoryState as InventoryProvider } from './context/InventoryContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InventoryTable from './components/InventoryTable';
import Operations from './pages/Operations'; 
import Audits from './pages/Audits';

const ProtectedLayout= ()=>{
    return(
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
        <Outlet />
        </main>
      </div>
    );
};

export default function App() {
  return (
    <InventoryProvider>
        
            <Routes>
              
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Login />} />

              <Route path="/register" element={<Register />} />
            <Route element= {<ProtectedLayout/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryTable />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/audits" element={<Audits />} />
            </Route>
              
            </Routes>
    </InventoryProvider>
  );
}