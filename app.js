const express = require('express');
const app = express();

app.use('/', (req, res, next) => {
    return res.status(200).send({
        messagem: 'Tudo ok!',
    });
});

module.exports = app;