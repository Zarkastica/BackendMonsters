const express = require('express');
const router = express.Router();
const { getAllUsers, loginUser, createUser, updateUser, findUser, deleteUser } = require('./../controllers/user.controller');

router.get('/get-users', getAllUsers);
router.post('/create-user', createUser);
router.post('/login-user', loginUser);
router.get('/find-user/:id', findUser);
router.put('/update-user', updateUser);
router.delete('/delete-user/:id', deleteUser);

module.exports = router;