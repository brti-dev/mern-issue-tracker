const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

const port = process.env.API_SERVER_PORT || 3000;
const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';

// Global db connection variable
let db;
async function connectToDb() {
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
  // Increment counter and return updated document
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnNewDocument: true },
  );
  return result.value.current;
}

// API GraphQL schema

const aboutMessage = 'Issue Tracker API v1.0';

/**
 * Resolver function
 * @param {Object} obj Conains the result returned from the resolver on the parent field
 * @param {Object} args Arguments passed into the field in the query
 * @param {Object} context
 * @param {*} info
 */
function setAboutMessage(_, { message }) {
  return message;
}

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

function validateIssue(issue) {
  const errors = [];

  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long');
  }

  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is assigned');
  }

  if (errors.length > 0) {
    throw new UserInputError('Invalid input', { errors });
  }
}

async function issueAdd(_, { issue }) {
  validateIssue(issue);

  const newIssue = { ...issue };
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('issues');

  const result = await db.collection('issues').insertOne(newIssue);
  const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });

  console.log('Issue add; result:', issue, savedIssue);

  return savedIssue;
}

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
      return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
    },
    serialize(value) {
      return value.getTime(); // Value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        const value = new Date(ast.value);
        return Number.isNaN(value.getTime()) ? undefined : value;
      }
      return undefined;
    },
  }),
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

const app = express();

const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: enableCors,
});

// Start the server and wait for requests
(async function start() {
  try {
    await connectToDb();
    /**
         * @param port Listen on this port
         * @param callback Call when server has successfully started
         */
    app.listen(port, () => {
      console.log('API server started on port', port);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}());
