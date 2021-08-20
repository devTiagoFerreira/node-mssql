const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

//Routes
const planetas = require('./routes/planets');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    })
);

app.use('/planetas', planetas);

app.use('/fotos/planetas/:foto', (req, res, next) => {
    return res.sendFile(__dirname + '/img/planetas/'+req.params.foto);
});

app.use(express.static('public'));

app.use((req, res) => {
    return res.status(404).send({
        error: 'Rota não encontrada.',
    });
});

module.exports = app;
