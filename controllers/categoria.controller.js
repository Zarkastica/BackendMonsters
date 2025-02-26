const Categoria = require('./../models/categoria.model');
const mongoose = require('mongoose');

const createCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
        const nuevaCategoria = new Categoria({
            nombre: nombre
        });

        await nuevaCategoria.save();
        return res.status(200).json({ msg: 'Categoria añadida exitosamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error inesperado' });
    }
}

const readAllCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        return res.status(200).json({ categorias });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error inesperado' });
    }
}

const updateCategoria = async (req, res) => {
    const { nombre } = req.body;
    console.log(nombre);

    try {
        await Categoria.updateOne({ nombre }, {
            nombre: nombre,
        });
        return res.status(200).json({ msg: 'Categoria actualizada exitosamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error inesperado' });
    }
}

const deleteCategoria = async (req, res) => {
    const { _id } = { _id: req.params.id };
    console.log(_id);

    try {
        await Categoria.deleteOne({ _id });
        return res.status(200).json({ msg: 'Categoria eliminada exitosamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error inesperado' });
    }
}

module.exports = {createCategoria, readAllCategorias, updateCategoria, deleteCategoria};