const EmbeddedPostgres = require('embedded-postgres').default;
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

async function initializeDatabase() {
    console.log('Starting Embedded PostgreSQL engine...');
    const dbDir = path.join(__dirname, '..', '..', 'pg_data');
    
    // Instantiate embedded postgres
    const pg = new EmbeddedPostgres({
        databaseDir: dbDir,
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        authMethod: 'trust',
        persistent: true
    });

    try {
        try {
            await pg.initialise();
        } catch (err) {
            // Already initialised
        }
        await pg.start();
        console.log('Embedded PostgreSQL started on port 5432');

        // Connect pg pool to default postgres db
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'postgres',
            port: 5432,
        });

        // Create target database if it doesn't exist
        const dbCheck = await pool.query("SELECT 1 FROM pg_database WHERE datname = 'storeratingdb'");
        if (dbCheck.rowCount === 0) {
            await pool.query('CREATE DATABASE storeratingdb');
            console.log('Database storeratingdb created.');
        }
        await pool.end();

        // Connect to storeratingdb
        const dbPool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'storeratingdb',
            password: 'postgres',
            port: 5432,
        });

        // Execute schema SQL
        const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await dbPool.query(schemaSql);
        console.log('Database schema applied successfully.');

        // Seed data if no admin exists
        const userCheck = await dbPool.query("SELECT * FROM users WHERE role = 'ADMIN'");
        if (userCheck.rowCount === 0) {
            console.log('Seeding initial data...');
            const hashedPasswordAdmin = await bcrypt.hash('AdminPass123!', 10);
            const hashedPasswordOwner = await bcrypt.hash('OwnerPass123!', 10);
            const hashedPasswordUser = await bcrypt.hash('UserPass123!', 10);

            // Insert ADMIN
            const adminRes = await dbPool.query(
                `INSERT INTO users (name, email, password, address, role) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                ['System Administrator Account', 'admin@storerating.com', hashedPasswordAdmin, '100 Tech Headquarters Plaza, City Center', 'ADMIN']
            );

            // Insert STORE_OWNER
            const ownerRes = await dbPool.query(
                `INSERT INTO users (name, email, password, address, role) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                ['Johnathan Store Owner Person', 'owner@storerating.com', hashedPasswordOwner, '456 Business Boulevard, Commerce District', 'STORE_OWNER']
            );

            // Insert USER
            const normalUserRes = await dbPool.query(
                `INSERT INTO users (name, email, password, address, role) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                ['Alexander Normal User Customer', 'user@storerating.com', hashedPasswordUser, '789 Residential Avenue, Suburban Heights', 'USER']
            );

            // Insert Store
            const storeRes = await dbPool.query(
                `INSERT INTO stores (name, email, address, owner_id) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                ['Tech Superstore Flagship Center', 'contact@techsuperstore.com', '456 Business Boulevard, Commerce District', ownerRes.rows[0].id]
            );

            // Insert Store 2
            const store2Res = await dbPool.query(
                `INSERT INTO stores (name, email, address, owner_id) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                ['Gourmet Organic Food Market', 'info@gourmetorganic.com', '101 Fresh Produce Way, Market District', null]
            );

            // Insert Sample Rating
            await dbPool.query(
                `INSERT INTO ratings (user_id, store_id, rating) 
                 VALUES ($1, $2, $3)`,
                [normalUserRes.rows[0].id, storeRes.rows[0].id, 5]
            );

            console.log('Seed data inserted successfully.');
        } else {
            console.log('Database already seeded.');
        }

        await dbPool.end();
        console.log('Database initialization complete.');
        return pg;
    } catch (err) {
        console.error('Error during database initialization:', err);
        throw err;
    }
}

if (require.main === module) {
    initializeDatabase().then(() => {
        console.log('Done.');
        process.exit(0);
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = initializeDatabase;
