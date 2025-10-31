import pool from './db.js';
//feel free to get rid of this shite but its kinda handy to see if we can interact
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('YUPPPPPPP BROOOO'); //if this comes up it worked
    // run node testdatabase.js in the backend folder in terminal
    process.exit(0);
  } catch (err) {
    console.error('BOLLOCKS', err);
    process.exit(1);
  }
};

createTables();

//it fucking works
//im a god