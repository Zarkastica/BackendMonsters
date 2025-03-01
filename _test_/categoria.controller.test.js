const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Categoria = require('./../models/categoria.model');
const categoriaController = require('./../controllers/categoria.controller');

const app = express();
app.use(express.json());

app.post('/categoria', categoriaController.createCategoria);
app.get('/categorias', categoriaController.readAllCategorias);
app.put('/categoria/:id', categoriaController.updateCategoria);
app.delete('/categoria/:id', categoriaController.deleteCategoria);

describe('Categoria Controller', () => {
    beforeAll(async () => {
        const url = 'mongodb://127.0.0.1/test';
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Categoria.deleteMany({});
    });

    it('should create a new categoria', async () => {
        const res = await request(app)
            .post('/categoria')
            .send({ nombre: 'Test Categoria' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.msg).toEqual('Categoria añadida exitosamente');
    });

    it('should read all categorias', async () => {
        const categoria = new Categoria({ nombre: 'Test Categoria' });
        await categoria.save();

        const res = await request(app).get('/categorias');

        expect(res.statusCode).toEqual(200);
        expect(res.body.categorias.length).toBe(1);
        expect(res.body.categorias[0].nombre).toBe('Test Categoria');
    });

    it('should update a categoria', async () => {
        const categoria = new Categoria({ nombre: 'Test Categoria' });
        await categoria.save();

        const res = await request(app)
            .put(`/categoria/${categoria._id}`)
            .send({ nombre: 'Updated Categoria' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.msg).toEqual('Categoria actualizada exitosamente');

        const updatedCategoria = await Categoria.findById(categoria._id);
        expect(updatedCategoria.nombre).toBe('Updated Categoria');
    });

    it('should delete a categoria', async () => {
        const categoria = new Categoria({ nombre: 'Test Categoria' });
        await categoria.save();

        const res = await request(app).delete(`/categoria/${categoria._id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.msg).toEqual('Categoria eliminada exitosamente');

        const deletedCategoria = await Categoria.findById(categoria._id);
        expect(deletedCategoria).toBeNull();
    });
});
