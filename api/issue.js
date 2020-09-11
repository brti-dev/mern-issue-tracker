const { UserInputError } = require('apollo-server-express');

const { getDb, getNextSequence } = require('./db');

/**
 * GraphQL resolver functions
 * Queries MongoDB
 */

/**
 * List of issues
 * GraphQL Resolver function
 *
 * @param {Object} obj Contains the result returned from the resolver on the parent field.
 * @param {Object} args Arguments passed into the field in the query
 * @param {Object} context
 * @param {*} info
 *
 * @returns {Array} Issues
 */
async function list(_, args) {
    // arg `status` passed by qs via React Router (`Contents` component)
    // /#/issues?status=New
    const { status, effortMin, effortMax } = args;
    const filter = {};
    if (status) {
        filter.status = status;
    }

    // filter `effort` field
    if (effortMin !== undefined || effortMax !== undefined) {
        filter.effort = {};
        if (effortMin !== undefined) {
            filter.effort.$gte = effortMin;
        }
        if (effortMax !== undefined) {
            filter.effort.$lte = effortMax;
        }
    }

    const issues = await getDb().collection('issues').find(filter).toArray();

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

async function get(_, { id }) {
    const db = getDb();
    const issue = await db.collection('issues').findOne({ id });

    return issue;
}

async function update(_, { id, changes }) {
    const db = getDb();

    if (changes.title || changes.status || changes.owner) {
        const issue = await db.collection('issues').findOne({ id });
        Object.assign(issue, changes);
        validate(issue);
    }

    await db.collection('issues').updateOne({ id }, { $set: changes });
    const savedIssue = await db.collection('issues').findOne({ id });

    return savedIssue;
}

/**
 * Resolver to delete an issue. Because `delete` is a reserved word in js, use `remove` alias here,
 * but export as `delete`.
 */
async function remove(_, { id }) {
    const db = getDb();
    const issue = await db.collection('issues').findOne({ id });
    if (!issue) {
        return false;
    }
    issue.deleted = new Date();

    let result = await db.collection('deleted_issues').insertOne(issue);
    if (result.insertedId) {
        result = await db.collection('issues').removeOne({ id });

        return result.deletedCount === 1;
    }

    return false;
}

module.exports = {
    list, add, get, update, delete: remove,
};
