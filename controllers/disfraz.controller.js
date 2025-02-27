const Disfraz = require('../models/disfraz.model');
const Categoria = require('../models/categoria.model');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const AgregarDisfraz = async (req, res) => {
    const {nombre, talla, color, precio, categoria} = req.body;
    try {
        const cat = await Categoria.findOne({nombre: categoria});
        if (!cat) {
            return res.status(404).json({msg: 'La categoría no existe'});
        } 
        let data_Disfraz = new Disfraz({
            nombre,
            talla,
            color,
            precio,
            categoria: cat._id,
            imagen: req.file.path
        });
        await data_Disfraz.save()
        data_Disfraz.populate('categoria');
        res.send(data_Disfraz)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error, contáctanos')
    }
}

const traerDisfraz = async (req, res)=>{
    try {
        let data_Disfraz = await Disfraz.find()
        res.json(data_Disfraz)
    
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error en el servidor')
    }
}


const traerDisfrazPorId = async (req,res) => {
    try {
        let data_Disfraz = await Disfraz.findById(req.params.id)
        if(!data_Disfraz){
            res.status(404).json({msg:'Producto no encontrado'})
        }
        res.json(data_Disfraz)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error con el servidor :(')
        
    }
}

const actualizarDisfrazPorId = async (req,res) =>{
    try {
        let data_Disfraz = await Disfraz.findByIdAndUpdate(req.params.id,req.body)
        if(!data_Disfraz){
            res.status(404).json({msg:'Producto no encontrado'})
        }
        res.json(data_Disfraz)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error con el servidor :(')
    }
}

const eliminarDisfrazPorId = async (req,res) =>{
    try {
        let data_Disfraz = await Disfraz.findByIdAndDelete(req.params.id)
        if(!data_Disfraz){
            res.status(404).json({msg:'Producto no encontrado'})
        }
        res.json(data_Disfraz)
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error con el servidor :(')
    }
}

module.exports = {AgregarDisfraz,traerDisfraz,traerDisfrazPorId,actualizarDisfrazPorId,eliminarDisfrazPorId};