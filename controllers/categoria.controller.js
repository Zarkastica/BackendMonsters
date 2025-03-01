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
    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { nombre }, { new: true });
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoria no encontrada' });
        }

        res.json({ msg: 'Categoria actualizada exitosamente', categoria });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la categoria' });
    }
};

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