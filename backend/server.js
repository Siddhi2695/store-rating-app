const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const EmbeddedPostgres = require('embedded-postgres').default;
const initDb = require('./config/initDb');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const userStoreRoutes = require('./routes/userStoreRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api', userStoreRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'FullStack Store Rating API is active',
        status: 'OK',
        timestamp: new Date()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack);
    res.status(500).json({
        message: err.message || 'An unexpected internal server error occurred'
    });
});

const PORT = process.env.PORT || 5000;

async function startApp() {
    try {
        console.log('Checking PostgreSQL database status...');
        const dbDir = path.join(__dirname, '..', 'pg_data');
        const pg = new EmbeddedPostgres({
            databaseDir: dbDir,
            port: 5432,
            user: 'postgres',
            password: 'postgresPassword123!',
            authMethod: 'trust',
            persistent: true,
            onLog: () => {}
        });

        try { 
            await pg.initialise(); 
        } catch (e) {
            // Ignore if already initialised
        }

        try { 
            await pg.start(); 
            console.log('Started embedded PostgreSQL database.');
        } catch (e) {
            console.log('PostgreSQL database server is active.');
        }

        // Ensure tables & seed data exist
        try {
            await initDb();
        } catch (e) {
            console.log('DB tables and seed verified.');
        }

        app.listen(PORT, () => {
            console.log(`========================================`);
            console.log(`Backend Server running on port ${PORT}`);
            console.log(`API URL: http://localhost:${PORT}`);
            console.log(`========================================`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startApp();