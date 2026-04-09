const db= require('../db');
const bcrypt= require('bcrypt');

exports.registerUser= async(req,res, next)=>{
    try{
        const {name, email, password, organization_id}= req.body;

        if(!name || !email || !password || !organization_id){
            return res.status(400).json({ message: 'All fields are required' });
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password, salt);

        const query=`INSERT INTO users (name, email, password, organization_id) 
                    VALUES ($1,$2,$3,$4) 
                    RETURNING id,name, email, organization_id`;
        const values= [name,email,hashedPassword, organization_id];
        const result= await db.query(query,values);
        res.status(201).json({
            message: 'User Registered Successfully',
            user: result.rows[0]
        });            
    }
    catch(err){
        next(err);
    }
}

exports.login= async (req,res, next)=>{
    try{
        const{email, password}=req.body;
        if(!email||!password){
            return res.status(400).json({message: 'Please provide email and password'});
        }

        const userResult= await db.query('SELECT * FROM users WHERE email=$1',[email]);
        const user= userResult.rows[0];

        if(!user||!(await bcrypt.compare(password, user.password))){
           return res.status(401).json({message: 'Invalid email or password'});
        }

        const token= jwt.sign(
            {
                id: user.id,
                organization_id: user.organization_id,
                name:user.name
            },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );
        

        delete user.password;
        res.status(200).json({
            message:'Login successful',
            user: user
        });
    }
    catch(err){
        next(err);
    }
};