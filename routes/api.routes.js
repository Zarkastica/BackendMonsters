const express = require('express');
const router = express.Router();

//rutas
const user = require('./user.routes');
const categoria = require('./categoria.routes');
const disfraz = require('./disfraz.routes');
const parentPath = '/api';

router.use(parentPath, user);
router.use(parentPath, categoria);  
router.use(parentPath, disfraz);
//TEST
module.exports = router;