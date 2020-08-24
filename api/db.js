require('dotenv').config();
const { MongoClient } = require('mongodb');

// Global db connection variable
let db;
async function connectToDb() {
    const url = process.env.DB_URL;
    const client = new MongoClient(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
    );

    await client.connect();
    console.log('Connected to MongoDB via ', url);
    db = client.db();
    const test_db_schema = await db.collection('issues').find({}).toArray();
    console.log(test_db_schema);
}

/**
 * Increment counter and get update count
 *
 * @param {string} name Name of collection
 *
 * @returns {number} Updated count
 */
async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { current: 1 } },
        { returnNewDocument: true },
    );
    return result.value.current + 1;
}

function getDb() {
    return db;
}

module.exports = { connectToDb, getNextSequence, getDb };
