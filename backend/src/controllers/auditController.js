const db= require('../db');

exports.getAudits= async (req, res)=>{

    try{
        const {organization_id}= req.user;
        const query=`SELECT 
                    id,
                    item_id,
                    item_name,
                    action_type,
                    old_type,
                    new_value,
                    created_at
                FROM audits
                where organization_id= $1
                ORDER BY created_at DESC
                    `;
        const{rows}= await db.query(query, [organization_id]);    
        res.status(200).json({
            success: true,
            data: rows});
}

catch(err){
    console.error('Audit Fetch Error: ', err.message);
    res.status(500).json(
        {
            success:false,
            message: 'Server Error: Unable to retrieve audit logs.'
        });
}
};