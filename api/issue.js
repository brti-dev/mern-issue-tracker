const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db');

async function list() {
    const db = getDb();
    const issues = await db.collection('issues').find({}).toArray();
    return issues;
}

function validate(issue) {
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

async function add(_, { issue }) {
    validate(issue);

    const db = getDb();
    const newIssue = { ...issue };
    newIssue.created = new Date();
    newIssue.id = await getNextSequence('issues');

    const result = await db.collection('issues').insertOne(newIssue);
    const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });

    console.log('Issue add; result:', issue, savedIssue);

    return savedIssue;
}

module.exports = { list, add };
