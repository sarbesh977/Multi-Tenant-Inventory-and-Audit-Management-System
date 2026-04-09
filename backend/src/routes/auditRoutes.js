const express= require('express');
const router= express.Router();

const {getAudits}= require('..controllers/auditControllers.js');
const {protect}= require('../routes/authMiddleware');

router.get('/', protect, getAudits);

module.exports = router;