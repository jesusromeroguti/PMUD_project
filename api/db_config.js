const mariadb = require('mariadb/callback');

// Dades de configuració de la base de dades
const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recetas',
};

const getConnection = () => {
    return mariadb.createConnection(config);
};

module.exports = getConnection;
