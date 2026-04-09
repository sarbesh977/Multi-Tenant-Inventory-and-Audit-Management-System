const express=require('express');
const cors= require('cors');
const helmet= require('helmet');
const morgan= require('morgan');
const userRoutes= require('./routes/userRoutes');
const itemRoutes= require('./routes/itemRoutes');
const auditRoutes= require('./routes/auditRoutes');

require('dotenv').config();

const db= require('./db');

const app= express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

app.get('/health', async(req,res)=>{
    try{
        const dbCheck= await db.query('Select Now()');
        res.status(200).json({
            status: 'UP',
            server_time: new Date().toISOString(),
            database: 'Connected',
            db_time: dbCheck.rows[0].now
        });
    } catch(err){
        res.status(500).json({
            status: 'DOWN',
            database: 'DISCONNECTED',
            error: err.message
        });
    }
});

    app.use((err, req, res, next)=>{
        console.error(err.stack);
        res.status(500).json(
            {
                message:'Something went wrong on the server!',
                error: process.env.NODE_ENV==='production' ? {}:err.message
            });
    });

    const PORT = process.env.PORT||5000;
    app.listen(PORT,()=>{
        console.log(`Server is running!
        URL: http://localhost:${PORT}
        Health Check: http://localhost:${PORT}/health
         `);
    });

