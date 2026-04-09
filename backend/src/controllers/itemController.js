const db= require('../db');

exports.updateItemQuantity= async(req,res)=>{

    const {id}= req.params;
    const {newQuantity}= req.body;

    const {organization_id, id: userId, name: userName}=req.user;

    try{
        const query=`SELECT name, quantity FROM items WHERE id=$1 AND organization_id=$2`;
        const itemCheck= await db.query(query, [id,organization_id]);

        if(itemCheck.rows.length===0){
            return res.status(404).json({message: "Item not found in your organization."});
        }
        const oldQuantity= itemCheck.rows[0].quantity;
        const itemName= itemCheck.rows[0].name;

        const queery=`UPDATE items SET quantity=$1, updated_at= NOW() where id=$2 AND organization_id=$3`
        await db.query(queery,[newQuantity,id,organization_id]);
        
        const auditQuery = `
            INSERT INTO audits 
            (organization_id, item_id, user_id, user_name, item_name, action_type, old_value, new_value) 
            VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
        `;

        const auditValues = [
            organization_id, 
            id,
            userId,
            userName,
            itemName, 
            'UPDATE', 
            oldQuantity.toString(), 
            newQuantity.toString(), 
        ];
        await db.query(auditQuery,auditValues);
        res.status(200).json({
            success: true,
            message: `Successfully updated ${itemName}`,
            updatedData: {
                updatedBy: userName,
                itemId: id,
                oldQuantity,
                newQuantity
            }
    });
    }
    catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Server Error during update." 
        });
    }

}

exports.addItem= async(req, res, next)=>{

    const {name, quantity, sku}= req.body;
    const {organization_id, name: userName}= req.user;

    try{
        const newItem= await db.query(
            `INSERT INTO items (name, quantity, sku, organization_id)
            VALUES ($1,$2,$3,$4) RETURNING *`, 
            [name, quantity, sku, organization_id]
        );

        const savedItem= newItem.rows[0];

        await db.query(
            `INSERT INTO audits
            (organization_id, item_id, user_id,user_name, item_name, action_type, old_value, new_value)
            VALUES ($1,$2,$3, $4,$5,$6, $7, $8)`, 
            [organization_id, savedItem.id, userId, userName, name, 'CREATE', '0', quantity.toString()]);

            res.status(201).json({success:true, data: savedItem});
    }
    catch(err){
        next(err);
}
};

exports.deleteItem= async (req, res, next)=>{

    const{id}= req.params;
    const{organization_id, id:userId, name: userName}= req.user;

    try{
        const itemCheck= await db.query(
            'SELECT name, quantity FROM items WHERE id=$1 AND organization_id= $2',
            [id, organization_id]
        );

        if(itemCheck.rows.length===0){
            return res.status(404).json({message:"Item not found"});
        }
        const {name:itemName, quantity:lastQuantity}=itemCheck.rows[0];
        
        const auditQuery=`
        INSERT INTO audits
        (organization_id, item_id, user_id, user_name, item_name, action_type, old_value, new_value)
        VALUES ($1,$2,$3,$4,$5,$6, $7,$8)
        `;

        const auditValues= [
            organization_id,
            id, 
            userId,
            userName,
            itemName, 
            'DELETE',
            lastQuantity.toString(),
            '0'
        ];
        await db.query(auditQuery, auditValues);
    await db.query(
        'DELETE FROM items WHERE id=$1 AND organization_id=$2',
        [id,organization_id]
    );
        res.status(200).json({
            success:true,
            message: `Item deleted. Audit logged for user: ${userName}`
        });        
    }
    catch(err){
        next(err);
    }
};