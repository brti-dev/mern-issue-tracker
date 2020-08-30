/**
 * initmongo_camval_node.js
 *
 * Initialize db collection `products` by:
 * - Truncating the current collection
 * - Inserting placeholder products
 * - Building indexes
 *
 * This script is intended to run on the shell, eg:
 * localhost: > mongo camval scripts/initmongo_camval.js
 * Atlas: > mongo <db_url> scripts/init.mongo.js
 */

/* global db print */
/* eslint no-restricted-globals: "off" */

db.products.remove({});
const productsDB = [
    {
        sku: 1,
        title: 'Organic Apples',
        description: 'How about them?',
        category: 'fruit',
        picture: true,
        price: 1.99,
        cost: 0.50,
        inventory: 16,
        created: new Date('2019-01-15'),
    }, {
        sku: 2,
        title: 'Bartlett Pears',
        description: 'All weekend long, pear after pear.',
        category: 'fruit',
        picture: true,
        price: 3.99,
        cost: 1.67,
        inventory: 0,
        created: new Date('1982-05-04'),
    }, {
        sku: 3,
        title: 'Mackinaw Peaches',
        description: 'Well, they\'re in!',
        category: 'fruit',
        picture: false,
        price: 2.55,
        cost: 2.50,
        inventory: 2,
        created: new Date(),
    },
];
db.products.insertMany(productsDB);
const count = db.products.count();
print('Inserted', count, 'products');

// Track number of products in the `counters` collection
db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ title: 'text', products: 'text' });
db.products.createIndex({ created: 1 });
