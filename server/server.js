const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost/issuetracker'
// Global db connection variable
let db
async function connectToDb() {
    const client = new MongoClient(
        url, 
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    await client.connect()
    console.log('Connected to MongoDB via ', url)
    db = client.db()
    const test_db_schema = await db.collection('issues').find({}).toArray()
    console.log(test_db_schema)
}

/**
 * Increment counter and get update count
 * 
 * @param {string} name Name of collection
 * 
 * @returns {number} Updated count
 */
async function getNextSequence(name) {
    // Increment counter and return updated document
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { current: 1 } },
        { returnNewDocument: true },
    )
    return result.value.current
}

// API GraphQL schema

let aboutMessage = 'Issue Tracker API v1.0';

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList,
    },
    Mutation: {
        setAboutMessage,
        issueAdd,
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'A Date() type in GraphQL as a scalar',
        parseValue(value) { // Value from the client
            const dateValue = new Date(value);
            return isNaN(dateValue) ? undefined : dateValue;
        },
        serialize(value) {
            return value.getTime(); // Value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind == Kind.STRING) {
                const value = new Date(ast.value);
                return isNaN(value) ? undefined : value;
            }
            if (ast.kind === Kind.INT) {
                return new Date(+ast.value) // ast value is always in string format
            }
            return undefined;
        }
    }),
}

/**
 * Resolver function
 * @param {Object} obj Conains the result returned from the resolver on the parent field
 * @param {Object} args Arguments passed into the field in the query
 * @param {Object} context 
 * @param {*} info
 */
function setAboutMessage(obj, args, context, info) {
    return aboutMessage = args.message;
}

function validateIssue(issue) {
    const errors = [];
    
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long');    
    }

    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is assigned');
    }

    if (errors.length > 0) {
        throw new UserInputError('Invalid input', { errors });
    }
}

async function issueAdd(_, { issue }) {
    const errors = []

    validateIssue(issue);
    
    issue.created = new Date();
    issue.id = await getNextSequence('issues')

    const result = await db.collection('issues').insertOne(issue)
    const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId })

    console.log('Issue add; result:', issue, savedIssue);
    
    return savedIssue;
}

async function issueList() {
    const issues = await db.collection('issues').find({}).toArray()
    return issues
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    },
});

const app = express()

// Middleware function
const fileServerMiddleware = express.static('public')

// Mount static middleware for use in the app
/**
 * @param url Base URL of any HTTP request to match
 * @param middlewareFunction
 */
app.use('/', fileServerMiddleware)

app.get('/hello/:place', (req, res) => {
    res.send(`Hello ${req.params.place}`)
})

app.all('/forbidden', (req, res) => {
    res.status(403).send('Access Denied')
})

server.applyMiddleware({ app, path: '/graphql' });

// Start the server and wait for requests
(async function() {
    try {
        await connectToDb()
        /**
         * @param port Listen on this port
         * @param callback Call when server has successfully started
         */
        app.listen(3000, function() {
            console.log('App started on port 3000')
        })
    } catch (err) {
        console.error('Error:', err)
    }
})()
