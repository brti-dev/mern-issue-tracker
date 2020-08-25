const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db');

/**
 * List of products
 * GraphQL Resolver function
 *
 * @param {Object} obj Contains the result returned from the resolver on the parent field.
 * @param {Object} args Arguments passed into the field in the query
 * @param {Object} context
 * @param {*} info
 *
 * @returns {Array} products
 */
async function list(_, { status }) {
    const db = getDb();
    const filter = {};
    if (status) {
        filter.status = status;
    }
    const products = await db.collection('products').find(filter).toArray();

    return products;
}

function validate(product) {
    const errors = [];

    if (product.title.length < 1) {
        errors.push('Field "title" must be at least 1 character long');
    }

    if (errors.length > 0) {
        throw new UserInputError('Invalid input', { errors });
    }
}

async function add(_, { product }) {
    validate(product);

    const db = getDb();
    const newProduct = { ...product };
    newProduct.created = new Date();
    newProduct.id = await getNextSequence('products');

    const result = await db.collection('products').insertOne(newProduct);
    const savedProduct = await db.collection('products').findOne({ _id: result.insertedId });

    console.log('Product add; result:', product, savedProduct);

    return savedProduct;
}

module.exports = { list, add };
