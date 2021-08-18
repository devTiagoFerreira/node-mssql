const mssql = require('mssql');

const config = {
    user: 'sa',
    password: 'teste123!',
    database: 'Sistema_Solar',
    server: 'localhost',
    port: 81,
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

exports.connect = mssql.connect(config);
