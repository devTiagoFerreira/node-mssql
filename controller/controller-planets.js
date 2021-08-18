const mssql = require('../mssql');
const sql = require('mssql');

exports.getPlanets = (req, res, next) => {
    mssql.connect
        .then((pool) => {
            pool.query('select * from Planetas order by distancia_sol')
                .then((results) => {
                    const result = results.recordset;
                    if (result.length != 0) {
                        return res.status(200).send({
                            response: {
                                results: result.length,
                                planets: result,
                            },
                        });
                    }
                    return res.status(404).send({
                        response: {
                            message: 'Nenhum planeta encontrado.',
                        },
                    });
                })
                .catch((error) => {
                    return res.status(500).send({
                        error: error,
                    });
                });
        })
        .catch((error) => {
            return res.status(500).send({
                error: error,
            });
        });
};

exports.getIdPlanets = (req, res, next) => {
    const planet = req.params.id_planeta;
    mssql.connect.then((pool) => {
        pool.query(`select * from Planetas where id =${planet}`)
            .then((results) => {
                const result = results.recordset;
                if (result.length != 0) {
                    return res.status(200).send({
                        response: {
                            results: result.length,
                            planets: result,
                        },
                    });
                }
                return res.status(404).send({
                    response: {
                        message: 'Nenhum planeta encontrado.',
                    },
                });
            })
            .catch((error) => {
                return res.status(500).send({
                    error: error,
                });
            });
    });
};

exports.postPlanets = (req, res, next) => {
    const { nome, distancia_sol, translacao, rotacao, diametro_equatorial, temperatura_superficie, densidade_media, num_satelites_naturais } = req.body;

    if (!nome) {
        return res.status(400).send({
            response: {
                message: 'Informe o nome do planeta.',
            },
        });
    }

    mssql.connect
        .then((pool) => {
            pool.query(`select id from Planetas where nome like '%${nome}%'`)
                .then((results) => {
                    const result = results.recordset;
                    if (result.length != 0) {
                        return res.status(422).send({
                            response: {
                                message: 'Já existe cadastro com esse planeta.',
                            },
                        });
                    }
                })
                .catch((error) => {
                    return res.status(500).send({
                        error: error,
                    });
                });

            pool.query(`insert into Planetas values ('${nome}', ${distancia_sol}, '${translacao}', '${rotacao}', ${diametro_equatorial}, '${temperatura_superficie}', ${densidade_media}, ${num_satelites_naturais} )`)
                .then((results) => {
                    const result = results.recordset;
                    return res.status(200).send({
                        response: {
                            message: 'Planeta adicionado com sucesso.',
                            planet: req.body,
                        },
                    });
                })
                .catch((error) => {
                    return res.status(500).send({
                        error: error,
                    });
                });
        })

        .catch((error) => {
            return res.status(500).send({
                error: error,
            });
        });
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

    mssql.connect
        .then((pool) => {
            pool.query(`update Planetas set nome = '${nome}', distancia_sol = ${distancia_sol}, translacao = '${translacao}', rotacao = '${rotacao}', diametro_equatorial = ${diametro_equatorial}, temperatura_superficie = '${temperatura_superficie}', densidade_media = ${densidade_media}, num_satelites_naturais = ${num_satelites_naturais} where id = ${planet}`)
                .then((results) => {
                    const result = results.recordset;
                    return res.status(200).send({
                        response: {
                            message: 'Planeta atualizado com sucesso.',
                            planet: req.body,
                        },
                    });
                })
                .catch((error) => {
                    return res.status(500).send({
                        error: error,
                    });
                });
        })

        .catch((error) => {
            return res.status(500).send({
                error: error,
            });
        });
};

exports.deletePlanets = (req, res, next) => {
    const planet = req.params.id_planeta;

    mssql.connect
        .then((pool) => {
            pool.query(`select id from Planetas where id = ${planet}`)
                .then((results) => {
                    const result = results.recordset;
                    if (!result.length != 0) {
                        return res.status(200).send({
                            response: {
                                message: 'Nenhum planeta encontrado.',
                            },
                        });
                    }
                })
                .catch((error) => {
                    return res.status(500).send({
                        error: error,
                    });
                });
            pool.query(`delete from Planetas where id = ${planet}`)
                .then((results) => {
                    const result = results.recordset;
                    return res.status(200).send({
                        response: {
                            message: 'Planeta excluído com sucesso.',
                        },
                    });
                })
                .catch((error) => {
                    return res.status(500).send({
                        error: error,
                    });
                });
        })
        .catch((error) => {
            return res.status(500).send({
                error: error,
            });
        });
};
