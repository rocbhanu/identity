const { Pool } = require('pg');
require('dotenv').config({debug:true});


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        require:true
    }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};