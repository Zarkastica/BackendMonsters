const express = require('express')
const router = express.Router()
const Itemcontroller = require('../controllers/Itemcontroller')

router.post('/Disfraz',Itemcontroller.AgregarDisfraz)
router.get('/Disfraz',Itemcontroller.traerDisfraz)
router.get('/Disfraz/:id',Itemcontroller.traerDisfrazPorId)
router.put('/Disfraz/:id',Itemcontroller.actualizarDisfrazPorId)
router.delete('/Disfraz/:id',Itemcontroller.eliminarDisfrazPorId)
module.exports = router
