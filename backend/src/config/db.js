
require('dotenv').config(); 

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;


const poolConfig = {
    connectionString: connectionString,
    
    ssl: {
        // You might need to set this to true to allow connecting to Neon's self-signed SSL certificate
        rejectUnauthorized: false
    }
};


const pool = new Pool(poolConfig);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
   
    query: (text, params) => pool.query(text, params),

    pool: pool
};