require('dotenv').config();

//requerir el modulo de express
const express = require('express');
const conectardb = require('./config/db')
const api = require('./routes/api.routes')
const cors = require('cors')
const app = express()

conectardb()
//definimos un puerto para el servidor 3000
app.use(cors()) 
const PORT = 3000;

//definimos una ruta para el servidor

app.use(express.json()); //middleware para leer datos en formato json
app.use('/',api);

//iniciar el servidor y escuchar en el puerto indicado

app.listen(PORT, () =>  {
  console.log(`Servidor corriendo en el puerto ${PORT}`);  
})


