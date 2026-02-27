require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config');

const { database, user, password, options } = config.DATABASE;

console.log('Connecting to:', { database, user, host: options.host, port: options.port });

const sequelize = new Sequelize(database, user, password, options);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Check tables
        const tables = await sequelize.getQueryInterface().showAllSchemas();
        console.log('Tables:', tables);

        // Check Tag table specifically if possible, or just list all
        const [results] = await sequelize.query("SHOW TABLES");
        console.log('SHOW TABLES:', results);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
})();
