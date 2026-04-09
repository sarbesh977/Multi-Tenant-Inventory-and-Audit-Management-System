const db= require('../db');

exports.createOrganization=async(req, res, next )=>{
    try{
        const {name,location}= req.body;

        if(!name || !location ){
            return res.status(400).json({message: 'Both organization name and location are required'});
        }
        const query='INSERT INTO organizations (name,location) VALUES ($1,$2) RETURNING *';
        const result= await db.query(query, [name,location]);

        res.status(201).json({
            message: 'Organization Created Successfully',
            data: result.rows[0]
        });
    }
    catch(err){
        next(err);
    }
}