const Disfraz = require('../models/disfraz.model');
const Categoria = require('../models/categoria.model');
const fs = require('fs');

const AgregarDisfraz = async (req, res) => {
    const {nombre, talla, color, precio, categoria} = req.body;
    try {
        const cat = await Categoria.findOne({nombre: categoria});
        if (!cat) {
            return res.status(404).json({msg: 'La categoría no existe'});
        }
         saveImage(req.file);
        let data_Disfraz = new Disfraz({
            nombre,
            talla,
            color,
            precio,
            categoria: cat._id,
            imagen: req.file.originalname
        });
        await data_Disfraz.save()
        return res.status(200).send('Producto agregado exitosamente')
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error, contáctanos')
    }
}

const traerDisfraz = async (req, res) => {
    console.log('Controller: traerDisfraz called');
    try {
      const disfraces = await Disfraz.find().populate('categoria');
      console.log('Controller: find and populate completed');
      return res.status(200).json({ disfraces });
    } catch (error) {
      console.log('Controller: Error caught', error);
      return res.status(500).json({ msg: 'Hubo un error en el servidor' });
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

function saveImage(file){
    const newPath = `./uploads/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}

const getImage = (req, res) => {
    const {imagen} = req.params.name;
    const readStream = fs.createReadStream(`uploads/${imagen}`);
    readStream.pipe(res);
}

module.exports = {AgregarDisfraz,traerDisfraz,traerDisfrazPorId,actualizarDisfrazPorId,eliminarDisfrazPorId,getImage};