const EmbeddedPostgres = require('embedded-postgres').default;
const path = require('path');
const { pool } = require('./config/db');

async function testAutoStart() {
    const dbDir = path.join(__dirname, '..', 'pg_data');
    const pg = new EmbeddedPostgres({
        databaseDir: dbDir,
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        authMethod: 'trust',
        persistent: true,
        onLog: () => {}
    });

    try {
        try { await pg.initialise(); } catch(e) {}
        await pg.start();
        console.log('PostgreSQL started successfully!');
        
        const res = await pool.query('SELECT name, email, role FROM users');
        console.log('Query result success! Users in DB:', res.rows);
        
        await pool.end();
        await pg.stop();
        console.log('PostgreSQL stopped cleanly.');
    } catch (err) {
        console.error('Test failed:', err);
    }
}

testAutoStart();
