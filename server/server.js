const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
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

function issueAdd(_, { issue }) {
    validateIssue(issue);
    issue.created = new Date();
    issue.id = issuesDB.length + 1;
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
/**
 * @param port Listen on this port
 * @param callback Call when server has successfully started
 */
app.listen(3000, function() {
    console.log('App started on port 3000')
})