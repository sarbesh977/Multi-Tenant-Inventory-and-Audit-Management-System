const express= require('express');
const router= express.Router();
const {protect}= require('../middleware/authMiddleware');
const{updateItemQuantity}=require('../controllers/itemController');
const{addItem}= require('../controllers/itemController');


router.post('/', protect, addItem);
router.get('/', protect, getItems);
router.patch('/:id', protect, updateItemQuantity);
router.delete('/:id', protect, deleteItem);

module.exports = router;