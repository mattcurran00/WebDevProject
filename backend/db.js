//if u have a look at the .env file its a bit all over the place
//ignore it for now, get it working and clean it after
//postgres is wrecking my head and its midnight

import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const{ Pool } = pkg;

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export default pool; // default export kept for compatibility

// do u reckon anyone ever made like a diary of them descending into madness
//in a js file
//if not i am the first
//anyways this little thing should let us reuse this connection pretty much
//anywhere in the backend

//yeah so jus import this using : const result = await pool.query("SELECT * FROM users WHERE id=$1", [userId]);
//or something like that
//i think thats how it works