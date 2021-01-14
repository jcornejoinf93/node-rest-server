require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');


// habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
console.log()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

    if (err) {
        throw err;
    } else {
        console.log(`BD Online.. Ah no puedo?`)
    }

});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
})