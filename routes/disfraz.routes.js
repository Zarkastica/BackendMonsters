const express = require('express')
const router = express.Router()
const {AgregarDisfraz,traerDisfraz,traerDisfrazPorId,actualizarDisfrazPorId,eliminarDisfrazPorId} = require('./../controllers/disfraz.controller')

router.post('/Disfraz',AgregarDisfraz)
router.get('/Disfraz',traerDisfraz)
router.get('/Disfraz/:id',traerDisfrazPorId)
router.put('/Disfraz/:id',actualizarDisfrazPorId)
router.delete('/Disfraz/:id',eliminarDisfrazPorId)
module.exports = router
