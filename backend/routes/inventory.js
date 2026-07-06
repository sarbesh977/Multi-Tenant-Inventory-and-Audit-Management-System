const express= require('express');
const router= express.Router();
const pool = require('../database/db');
const verifyToken = require('../MiddleWare/authMiddleWare');

router.get('/', async (req,res) => {
    try{
        const result = await pool.query('SELECT * FROM inventories ORDER BY id DESC');
        const items= result.rows.map((item)=>({
            id: item.id,
            name: item.item_name,
            category: item.category,
            stock: item.quantity,
            price: parseFloat(item.price)||0.00
        }));
        return res.json(items);
    }
    catch(error){
        console.error("Database Error on GET inventory: ", error);
        return res.status(500).json({message: "Server error fetching inventory items"});
    }
});


router.get('/audit-history', async (req,res)=>{
    try{
        const result= await pool.query('SELECT * FROM audit_logs ORDER BY changed_at DESC');
        const logs= result.rows.map((log)=>{
            const difference= log.new_quantity- log.old_quantity;
            return {
            id: log.id,
            itemName : log.item_name,
            change: difference>0? `+${difference}`: `${difference}`,
            type: log.action_type,
            reason: log.change_reason || (difference>0 ? "Manual Increase": "Manual decrease"),
            timestamp: new Date(log.changed_at).toLocaleString()
        };
    });
    return res.json(logs);
    }
    catch(error){
        console.error("Database Error on GET audit-history:", error);
        return res.status(500).json({ message: "Server error fetching audit trail ledger." });
    }
});

router.post('/add', verifyToken, async (req, res) => {
    try {
        const { item_name, category, quantity, price } = req.body;
        const userId = req.user && req.user.id ? parseInt(req.user.id) : null;
        const operatorName = req.user && req.user.name ? req.user.name : 'System';

        const qty = parseInt(quantity) || 0;
        const finalPrice = parseFloat(price) || 0;

        const newItem = await pool.query(
            `INSERT INTO inventories (item_name, category, quantity, price)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [item_name || 'Unnamed Item', category || 'Hardware', qty, finalPrice]
        );

        const createdItem = newItem.rows[0];

        await pool.query(
            `INSERT INTO audit_logs (item_id, user_id, item_name, action_type, old_quantity, new_quantity, change_reason, operator_name)
             VALUES ($1, $2, $3, 'ADD', 0, $4, 'First Stock Entry', $5)`,
            [createdItem.id, userId, createdItem.item_name, qty, operatorName]
        );

        return res.status(201).json({
            message: "Item added & tracking logged successfully!",
            item: {
                id: createdItem.id,
                name: createdItem.item_name,
                category: createdItem.category,
                stock: createdItem.quantity,
                price: parseFloat(createdItem.price) || 0.00
            }
        });
    } catch (error) {
        console.error("CRITICAL SQL ERROR ON POST ADD:", error.message, error.stack);
        return res.status(500).json({ 
            message: "Database creation failure.",
            errorDetails: error.message
        });
    }
});

router.put('/update-stock/:id', verifyToken, async(req,res)=>{
try{
    const {id}= req.params;
    const {amount, reason}= req.body;
    const adjustmentAmount= parseInt(amount)||0;

    const userId= req.user.id;
    const operatorName= req.user.name;

    const currentCheck= await pool.query('SELECT * FROM inventories WHERE id=$1', [id]);
    if(currentCheck.rows.length===0){
        return res.status(404).json({ message: "Item not found in inventory table" });
    }
    const {quantity: oldQty, item_name: itemName}= currentCheck.rows[0];
    const targetQty= oldQty+adjustmentAmount;

    await pool.query(
            'UPDATE inventories SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', 
            [targetQty, id]
        );

        const logType= adjustmentAmount > 0 ? "RESTOCK" : "REDUCTION";
        await pool.query(
            `INSERT INTO audit_logs (item_id, user_id, item_name, action_type, old_quantity, new_quantity, change_reason, operator_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [id, userId, itemName, logType, oldQty, targetQty, reason, operatorName]
        );
        return res.json({message: "Stock adjustment successfully recorded!"});
}
catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server adjustment transaction crashed." });
    }

});

module.exports=router;