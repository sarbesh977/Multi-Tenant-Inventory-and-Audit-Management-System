const express= require('express');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcryptjs');

const router= express.Router();
const JWT_SECRET= process.env.JWT_SECRET;
const pool= require('../database/db');


router.post('/register', async(req,res)=>{

    try{
        console.log(" RECEIVED A REGISTER REQUEST WITH BODY:", req.body);
        const {name, email, password, role}= req.body;
        const userRole= role|| "Operator";

        const userCheck= await pool.query('SELECT * FROM users WHERE email= $1', [email]);
        if(userCheck.rows.length > 0) 
        {
            return res.status(400).json({message: "User already registerd with this email"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)', 
            [name, email, hashedPassword, userRole]
        );

        return res.status(201).json({message: "User registered successfully!"});
    }
    catch(error){
        console.error("Registration DB error: ", error);
        return res.status(500).json({message:"Server error during registration"});
    }
});

router.post('/login', async(req,res)=>{
    try{
        const {email, password}= req.body;
        const result= await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        const user= result.rows[0];
        if(!user)
            {
            return res.status(400).json({ message: "Invalid email or password credentials." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid email or password credentials." });
        }
        const token= jwt.sign(
            {id: user.id, name: user.name, role: user.role},
            JWT_SECRET,
            {expiresIn: '24h'}
        );
        return res.json({
            token,
            user:{id:user.id, name: user.name, email:user.email, role: user.role}
        });
    } catch(error){
        console.error('Real login error',error);
        return res.status(500).json({message:"Server error during login."});
    }
});

module.exports= router;
