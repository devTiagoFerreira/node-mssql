const mssql = require('../mssql');
const sql = require('mssql');
const path = require('path');
const utils = require('../utils/utils');

exports.getPlanets = (req, res, next) => {
    try {
        (async () => {
            const pool = await mssql.connect;
            const results = await pool.query('select * from Planetas order by distancia_sol');
            const { recordset } = results;
            if (recordset.length != 0) {
                recordset.map((row) => {
                    const url = { url: `http://localhost:${process.env.PORT}/fotos/planetas/${row.foto}` };
                    Object.assign(row, url);
                });
                return res.status(200).send({
                    response: {
                        results: recordset.length,
                        planets: recordset,
                    },
                });
            }
            return res.status(404).send({
                response: {
                    message: 'Nenhum planeta encontrado.',
                },
            });
        })();
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
};

exports.getIdPlanets = (req, res, next) => {
    const planet = req.params.id_planeta;
    try {
        (async () => {
            const pool = await mssql.connect;
            const results = await pool.query(`select * from Planetas where id =${planet}`);
            const { recordset } = results;
            if (recordset.length != 0) {
                recordset.map((row) => {
                    const url = { url: `http://localhost:${process.env.PORT}/fotos/planetas/${row.foto}` };
                    Object.assign(row, url);
                });
                return res.status(200).send({
                    response: {
                        results: recordset.length,
                        planets: recordset,
                    },
                });
            }
            return res.status(404).send({
                response: {
                    message: 'Nenhum planeta encontrado.',
                },
            });
        })();
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
};

exports.postPlanets = (req, res, next) => {
    const { nome, distancia_sol, translacao, rotacao, diametro_equatorial, temperatura_superficie, densidade_media, num_satelites_naturais } = req.body;

    try {
        var { filename } = req.file;
    } catch (error) {
        return res.status(400).send({
            response: {
                message: 'Adicione uma foto do planeta',
            },
        });
    }

    const url = path.join('./img/planetas/', filename);

    try {
        (async () => {
            const pool = await mssql.connect;
            const result = await pool.query(`select id from Planetas where nome like '%${nome}%'`);
            const { recordset } = result;
            if (recordset.length != 0) {
                utils.fileRemove(url);
                return res.status(422).send({
                    response: {
                        message: 'Já existe cadastro com esse planeta.',
                    },
                });
            }
            if (!nome) {
                utils.fileRemove(url);
                return res.status(400).send({
                    response: {
                        message: 'Informe o nome do planeta.',
                    },
                });
            }
            mssql.connect.then((pool) => {
                pool.query(`insert into Planetas values ('${nome}', ${distancia_sol}, '${translacao}', '${rotacao}', ${diametro_equatorial}, '${temperatura_superficie}', ${densidade_media}, ${num_satelites_naturais}, '${filename}')`).then((results) => {
                    const { recordset } = results;
                    return res.status(201).send({
                        response: {
                            message: 'Planeta adicionado com sucesso.',
                        },
                    });
                });
            });
        })();
    } catch (error) {
        utils.fileRemove(url);
        return res.status(500).send({
            error: error,
        });
    }
};

exports.patchPlanets = (req, res, next) => {
    const planet = req.params.id_planeta;
    const { nome, distancia_sol, translacao, rotacao, diametro_equatorial, temperatura_superficie, densidade_media, num_satelites_naturais } = req.body;
    if (!nome) {
        return res.status(400).send({
            response: {
                message: 'Informe o nome do planeta.',
            },
        });
    }

    try {
        var { filename } = req.file;
        var url = path.join('./img/planetas/', filename);
    } catch (error) {}

    try {
        (async () => {
            const pool = await mssql.connect;
            const results = await pool.query(`select id from Planetas where nome = '${nome}' and id != ${planet}`);
            let { recordset } = results;
            if (recordset.length > 0) {
                if (url) {
                    utils.fileRemove(url);
                }
                return res.status(422).send({
                    response: {
                        message: 'Já existe um planeta cadastrado com esse nome.',
                    },
                });
            }
            mssql.connect.then((pool) => {
                pool.query(`select foto from Planetas where id = ${planet}`).then((results) => {
                    const { recordset } = results;
                    if (recordset.length == 0) {
                        if (url) {
                            utils.fileRemove(url);
                        }
                        return res.status(404).send({
                            response: {
                                message: 'Planeta não encontrado.',
                            },
                        });
                    }
                    if (!filename) {
                        filename = recordset[0].foto;
                    }
                    if (recordset[0].foto != filename) {
                        url = path.join('./img/planetas', recordset[0].foto);
                        console.log(url);
                        utils.fileRemove(url);
                    }

                    pool.query(`update Planetas set nome = '${nome}', distancia_sol = ${distancia_sol}, translacao = '${translacao}', rotacao = '${rotacao}', diametro_equatorial = ${diametro_equatorial}, temperatura_superficie = '${temperatura_superficie}', densidade_media = ${densidade_media}, num_satelites_naturais = ${num_satelites_naturais}, foto = '${filename}' where id = ${planet}`).then(
                        (results) => {
                            return res.status(200).send({
                                response: {
                                    message: 'Planeta atualizado com sucesso.',
                                },
                            });
                        }
                    );
                });
            });
        })();
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
};

exports.deletePlanets = (req, res, next) => {
    const planet = req.params.id_planeta;

    try {
        (async () => {
            const pool = await mssql.connect;
            const results = await pool.query(`select foto from Planetas where id = ${planet}`);
            const { recordset } = results;
            if (!recordset.length != 0) {
                return res.status(200).send({
                    response: {
                        message: 'Nenhum planeta encontrado.',
                    },
                });
            }
            url = path.join('./img/planetas/', recordset[0].foto);
            utils.fileRemove(url);
            mssql.connect.then((results) => {
                pool.query(`delete from Planetas where id = ${planet}`).then((results) => {
                    const { recordset } = results;
                    return res.status(200).send({
                        response: {
                            message: 'Planeta excluído com sucesso.',
                        },
                    });
                });
            });
        })();
    } catch (error) {
        return res.status(500).send({
            error: error,
        });
    }
};
