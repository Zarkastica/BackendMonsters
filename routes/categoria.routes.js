const express = require('express');
const router = express.Router();
const {createCategoria, readAllCategorias, updateCategoria, deleteCategoria} = require('./../controllers/categoria.controller');

router.post('/create-categoria', createCategoria);
router.get('/categorias', readAllCategorias);
router.put('/update-categoria', updateCategoria);
router.delete('/delete-categoria/:id', deleteCategoria);

module.exports = router;
