const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const {AgregarDisfraz,traerDisfraz,traerDisfrazPorId,actualizarDisfrazPorId,eliminarDisfrazPorId,getImage} = require('./../controllers/disfraz.controller');

router.post('/Disfraz',upload.single('imagen'),AgregarDisfraz)
router.get('/Disfraz',traerDisfraz)
router.get('/Disfraz/:id',traerDisfrazPorId)
router.put('/Disfraz/:id',upload.single('imagen'),actualizarDisfrazPorId);
router.delete('/Disfraz/:id',eliminarDisfrazPorId);
router.get('/imagen/:name',getImage);
module.exports = router
