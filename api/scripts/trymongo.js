require('dotenv').config()
const { MongoClient } = require('mongodb')

const url = process.env.DB_URL || 'mongodb+srv://root:root91@cluster0.dsrzl.mongodb.net/issuetracker?retryWrites=true&w=majority'

async function testWithAsync() {
    console.log('\n--- test ---')

    const client = new MongoClient(url, { useNewUrlParser: true })
    
    try {
        await client.connect();
        const db = client.db()
        const collection = db.collection('employees')

        const employee = { id: Math.ceil(Math.random() * 100000), name: 'A. Callback', age:23 }
        const result = await collection.insertOne(employee)
        console.log('Result of insert:\n', result.insertedId)

        const docs = await collection.find({ _id: result.insertedId }).toArray()
        console.log('Result of find:\n', docs)
    } catch(error) {
        console.error(error)
    } finally {
        console.log('closing connection')
        client.close()
    }
}

testWithAsync()
