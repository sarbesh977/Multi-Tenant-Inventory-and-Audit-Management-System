const jwt= require('jsonwebtoken');
const JWT_SECRET= process.env.JWT_SECRET;

const verifyToken=(req,res,next)=>{
    const authHeader = req.headers['authorization'] || req.header('Authorization');
    const token= authHeader && authHeader.split(' ')[1];

    console.log(" Incoming Auth Header:", authHeader);
    if(!token){
        return res.status(401).json({message:"Access Denied. No token provided."});
    }

    try{
        const decoded= jwt.verify(token, JWT_SECRET);
        req.user= decoded;
        next();
    }
    catch(error){
        return res.status(403).json({message: "Invalid of expired token"});
    }
};
module.exports= verifyToken;
