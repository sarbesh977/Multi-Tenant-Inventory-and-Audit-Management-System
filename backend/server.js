const express= require('express');
const cors= require('cors');
const pool= require('./database/db');

const app= express();
const PORT= 5001;

app.use(cors());
app.use(express.json());

const authRoutes= require('./routes/auth');

app.use('/api/auth', authRoutes);

app.listen(PORT, ()=>{
    console.log(`Backend running in http://localhost:${PORT}`);
});