import { createConnection } from 'mysql2/promise';
import { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } from './src/config.js';

async function testConnection() {
    try {
        const connection = await createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
            database: DB_DATABASE,
        });
        console.log('OMG si funciona');
        connection.end();
    } catch (error) {
        console.error('NOO FUNCIONA', error);
    }
}

testConnection();
