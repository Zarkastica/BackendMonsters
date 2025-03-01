const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { getAllUsers, createUser, loginUser, findUser, updateUser, deleteUser } = require('../controllers/user.controller');
const User = require('../models/user.model');

const app = express();
app.use(express.json());

app.get('/users', getAllUsers);
app.post('/users', createUser);
app.post('/users/login', loginUser);
app.get('/users/:id', findUser);
app.put('/users', updateUser);
app.delete('/users/:id', deleteUser);

jest.mock('../models/user.model');
jest.mock('../middlewares/jwtGenerate', () => ({
    generateToken: jest.fn().mockResolvedValue('fakeToken')
}));

describe('User Controller', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            User.find.mockResolvedValue([{ username: 'testuser' }]);
            const res = await request(app).get('/users');
            expect(res.status).toBe(200);
            expect(res.body.users).toEqual([{ username: 'testuser' }]);
        });

        it('should handle errors', async () => {
            User.find.mockRejectedValue(new Error('Error'));
            const res = await request(app).get('/users');
            expect(res.status).toBe(500);
            expect(res.body.msg).toBe('Hubo un error');
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            User.findOne.mockResolvedValue(null);
            User.prototype.save = jest.fn().mockResolvedValue({});
            const res = await request(app).post('/users').send({ username: 'newuser', password: 'password' });
            expect(res.status).toBe(200);
            expect(res.body.msg).toBe('Usuario registrado exitosamente');
        });

        it('should return error if user already exists', async () => {
            User.findOne.mockResolvedValue({ username: 'existinguser' });
            const res = await request(app).post('/users').send({ username: 'existinguser', password: 'password' });
            expect(res.status).toBe(400);
            expect(res.body.msg).toBe('El usuario existinguser ya existe');
        });

        it('should handle errors', async () => {
            User.findOne.mockRejectedValue(new Error('Error'));
            const res = await request(app).post('/users').send({ username: 'newuser', password: 'password' });
            expect(res.status).toBe(500);
            expect(res.body.msg).toBe('Error inesperado');
        });
    });

    describe('loginUser', () => {
        it('should login user and return token', async () => {
            User.findOne.mockResolvedValue({ username: 'testuser', password: 'password' });
            const res = await request(app).post('/users/login').send({ username: 'testuser', password: 'password' });
            expect(res.status).toBe(200);
            expect(res.body.msg).toBe('Sesion iniciada');
            expect(res.body.token).toBe('fakeToken');
        });

        it('should return error if user does not exist', async () => {
            User.findOne.mockResolvedValue(null);
            const res = await request(app).post('/users/login').send({ username: 'nonexistentuser', password: 'password' });
            expect(res.status).toBe(400);
            expect(res.body.msg).toBe('El usuario no existe');
        });

        it('should return error if password is incorrect', async () => {
            User.findOne.mockResolvedValue({ username: 'testuser', password: 'wrongpassword' });
            const res = await request(app).post('/users/login').send({ username: 'testuser', password: 'password' });
            expect(res.status).toBe(400);
            expect(res.body.msg).toBe('Contraseña incorrecta');
        });

        it('should handle errors', async () => {
            User.findOne.mockRejectedValue(new Error('Error'));
            const res = await request(app).post('/users/login').send({ username: 'testuser', password: 'password' });
            expect(res.status).toBe(500);
            expect(res.body.msg).toBe('Error inesperado');
        });
    });

    describe('findUser', () => {
        it('should return user by username', async () => {
            User.findOne.mockResolvedValue({ username: 'testuser', _id: '123' });
            const res = await request(app).get('/users/testuser');
            expect(res.status).toBe(200);
            expect(res.body.User).toEqual({ username: 'testuser', id: '123' });
        });

        it('should return error if user does not exist', async () => {
            User.findOne.mockResolvedValue(null);
            const res = await request(app).get('/users/nonexistentuser');
            expect(res.status).toBe(400);
            expect(res.body.msg).toBe('El usuario no existe');
        });

        it('should handle errors', async () => {
            User.findOne.mockRejectedValue(new Error('Error'));
            const res = await request(app).get('/users/testuser');
            expect(res.status).toBe(500);
            expect(res.body.msg).toBe('Error inesperado');
        });
    });

    describe('updateUser', () => {
        it('should update user password', async () => {
            User.findOne.mockResolvedValue({ username: 'testuser', password: 'password' });
            User.updateOne.mockResolvedValue({});
            const res = await request(app).put('/users').send({ username: 'testuser', password: 'password', updatedPassword: 'newpassword' });
            expect(res.status).toBe(200);
            expect(res.body.msg).toBe('Contraseña actualizada exitosamente');
        });

        it('should return error if current password is incorrect', async () => {
            User.findOne.mockResolvedValue({ username: 'testuser', password: 'wrongpassword' });
            const res = await request(app).put('/users').send({ username: 'testuser', password: 'password', updatedPassword: 'newpassword' });
            expect(res.status).toBe(400);
            expect(res.body.msg).toBe('Contraseña incorrecta');
        });

        it('should handle errors', async () => {
            User.findOne.mockRejectedValue(new Error('Error'));
            const res = await request(app).put('/users').send({ username: 'testuser', password: 'password', updatedPassword: 'newpassword' });
            expect(res.status).toBe(500);
            expect(res.body.msg).toBe('Error inesperado');
        });
    });

    describe('deleteUser', () => {
        it('should delete user by username', async () => {
            User.deleteOne.mockResolvedValue({});
            const res = await request(app).delete('/users/testuser');
            expect(res.status).toBe(200);
            expect(res.body.msg).toBe('Usuario eliminado exitosamente');
        });

        it('should handle errors', async () => {
            User.deleteOne.mockRejectedValue(new Error('Error'));
            const res = await request(app).delete('/users/testuser');
            expect(res.status).toBe(500);
            expect(res.body.msg).toBe('Error inesperado');
        });
    });
});