const express= require('express');
const cors= require('cors');
const pool= require('./database/db');

const app= express();
const PORT= 5001;

app.use(cors());
app.use(express.json());

const authRoutes= require('./routes/auth');
<<<<<<< HEAD
const inventoryRoutes= require('./routes/inventory');

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
=======

app.use('/api/auth', authRoutes);
>>>>>>> 03c7d6d6792d71860ce60440864fcc1e15927d61

app.listen(PORT, ()=>{
    console.log(`Backend running in http://localhost:${PORT}`);
});