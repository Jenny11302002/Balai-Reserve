// scripts/setupDatabase.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Starting database setup...\n');

    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✓ Connected to MySQL server');

    // Read SQL file
    const sqlFile = path.join(__dirname, '..', 'database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute SQL commands
    await connection.query(sql);
    console.log('✓ Database created successfully');
    console.log('✓ Tables created successfully');
    console.log('✓ Sample data inserted\n');

    console.log('=====================================');
    console.log('✅ Database setup complete!');
    console.log('=====================================');
    console.log('Database: ereserve');
    console.log('Tables:');
    console.log('  - bookings');
    console.log('  - customers');
    console.log('  - rooms');
    console.log('  - users');
    console.log('=====================================');
    console.log('\nYou can now start the server with:');
    console.log('npm start (or) npm run dev\n');

  } catch (error) {
    console.error('✗ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase();