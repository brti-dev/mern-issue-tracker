const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

// API GraphQL schema

let aboutMessage = 'Issue Tracker API v1.0';

let issuesDB = [
    {
        id: 1,
        status: 'New',
        owner: 'Ravan',
        effort: 5,
        created: new Date('2019-01-15'),
        due: undefined,
        title: 'Error in console when clicking "Add"',
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Eddie',
        effort: 14,
        created: new Date('2019-01-16'),
        due: new Date('2019-02-16'),
        title: 'Missing bottom border panel',
    }
]

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
            return new Date(value);
        },
        serialize(value) {
            return value.getTime(); // Value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind == Kind.STRING) {
                return new Date(ast.value);
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

function issueAdd(_, { issue }) {
    issue.created = new Date();
    issue.id = issuesDB.length + 1;
    if (issue.status == undefined) {
        issue.status = 'New';
    }
    issuesDB.push(issue);
    console.log('Issue Add', issue);
    return issue;
}

function issueList() {
    return issuesDB;
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
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
/**
 * @param port Listen on this port
 * @param callback Call when server has successfully started
 */
app.listen(3000, function() {
    console.log('App started on port 3000')
})