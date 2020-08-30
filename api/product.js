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
 * @returns {Array} Products
 */
async function list(_, { category }) {
    const db = getDb();
    const filter = {};
    if (category) {
        filter.category = category;
    }
    const products = await db.collection('products').find(filter).toArray();

    return products;
}

/**
 * Check new product object for errors.
 *
 * @param {Object} product Product
 */
function validate(product) {
    const errors = [];

    if (product.title.length < 1) {
        errors.push('Field "title" must be at least 1 character long');
    }

    if (errors.length > 0) {
        throw new UserInputError('Invalid input', { errors });
    }
}

/**
 * Add a new product to db.
 * GraphQL Resolver function
 *
 * @param {Object} obj Contains the result returned from the resolver on the parent field.
 * @param {Object} args Arguments passed into the field in the query
 */
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

/**
 * Get a product from db.
 * GraphQL Resolver function
 *
 * @param {Object} obj Contains the result returned from the resolver on the parent field.
 * @param {Object} args Arguments passed into the field in the query
 */
async function get(_, { id }) {
    const db = getDb();
    const issue = await db.collection('issues').findOne({ id });

    return issue;
}

module.exports = { list, add, get };
