const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Disfraz = require('../models/disfraz.model');
const Categoria = require('../models/categoria.model');
const disfrazController = require('../controllers/disfraz.controller');

const app = express();
app.use(express.json());
app.post('/disfraz', disfrazController.AgregarDisfraz);
app.get('/disfraz', disfrazController.traerDisfraz);
app.get('/disfraz/:id', disfrazController.traerDisfrazPorId);
app.put('/disfraz/:id', disfrazController.actualizarDisfrazPorId);
app.delete('/disfraz/:id', disfrazController.eliminarDisfrazPorId);

describe('Disfraz Controller', () => {
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/disfraz_test`;
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    let categoriaId;

    beforeEach(async () => {
        const categoria = new Categoria({ nombre: 'Categoria Test' });
        await categoria.save();
        categoriaId = categoria._id;
    });

    afterEach(async () => {
        await Disfraz.deleteMany({});
        await Categoria.deleteMany({});
    });

    it('should create a new disfraz', async () => {
        const res = await request(app)
            .post('/disfraz')
            .send({
                nombre: 'Disfraz Test',
                talla: 'M',
                color: 'Rojo',
                precio: 100,
                categoria: 'Categoria Test'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.nombre).toBe('Disfraz Test');
    });

    it('should get all disfraces', async () => {
        const disfraz = new Disfraz({
            nombre: 'Disfraz Test',
            talla: 'M',
            color: 'Rojo',
            precio: 100,
            categoria: categoriaId
        });
        await disfraz.save();

        const res = await request(app).get('/disfraz');
        expect(res.statusCode).toEqual(200);
        expect(res.body.disfraces.length).toBe(1);
        expect(res.body.disfraces[0].nombre).toBe('Disfraz Test');
    });

    it('should get a disfraz by id', async () => {
        const disfraz = new Disfraz({
            nombre: 'Disfraz Test',
            talla: 'M',
            color: 'Rojo',
            precio: 100,
            categoria: categoriaId
        });
        await disfraz.save();

        const res = await request(app).get(`/disfraz/${disfraz._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.nombre).toBe('Disfraz Test');
    });

    it('should update a disfraz by id', async () => {
        const disfraz = new Disfraz({
            nombre: 'Disfraz Test',
            talla: 'M',
            color: 'Rojo',
            precio: 100,
            categoria: categoriaId
        });
        await disfraz.save();

        const res = await request(app)
            .put(`/disfraz/${disfraz._id}`)
            .send({ nombre: 'Disfraz Updated' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.nombre).toBe('Disfraz Updated');
    });

    it('should delete a disfraz by id', async () => {
        const disfraz = new Disfraz({
            nombre: 'Disfraz Test',
            talla: 'M',
            color: 'Rojo',
            precio: 100,
            categoria: categoriaId
        });
        await disfraz.save();

        const res = await request(app).delete(`/disfraz/${disfraz._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.nombre).toBe('Disfraz Test');
    });
});