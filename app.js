const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const sql = require('mssql');

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

app.use((req, res) => {
    res.status(404).send({
        error: 'Rota não encontrada.',
    });
});

module.exports = app;
