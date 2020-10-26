const express = require('express');
const nonauthController = require('../controllers/nonauth');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render('signup')
})

router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/stats', nonauthController.stats)







module.exports = router;