const express = require('express')
const router = express.Router()
const Itemcontroller = require('../controllers/Itemcontroller')

router.post('/Disfraz',Itemcontroller.AgregarDisfraz)
router.get('/Disfraz',Itemcontroller.traerDisfraz)
router.get('/Disfraz/:id',Itemcontroller.traerDisfrazPorId)

module.exports = router
