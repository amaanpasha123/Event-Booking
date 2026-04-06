const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ UNDEFINED');
console.log('URI value:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, { dbName: 'eventora' })
    .then(() => {
        console.log('✅ Connected to DB:', mongoose.connection.name);
        console.log('✅ Host:', mongoose.connection.host);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });