const request = require('request');
const { getDb, getNextSequence } = require('../db');

/*
* Run using the mongo shell. For remote databases, ensure that the
* connection string is supplied in the command line:
* $ mongo <db_url> scripts/initmongo_vgcollection.js
*/

const api_endpoint = 'http://vgsite/api/';
const credentials = {
    grant_type: 'authorization_code',
    client_id: 1,
    client_secret: 'foo',
};

request.post({
    url: `${api_endpoint}token`,
    headers: {
        'Content-Type': 'application/json',
    },
    json: credentials,
}, (error, response, body) => {
    console.log(response);

    const db = getDb();

    db.games.remove({});
    const vgcollectionDB = [
        {
            title: 'Animal Crossing',
            release: new Date('2002-01-16'),
            last_updated: new Date(),
        }, {
            title: 'Resident Evil 2',
            release: new Date('2019-01-16'),
            last_updated: new Date(),
        },
    ];
    db.games.insertMany(vgcollectionDB);
    const count = db.games.count();
    print('Inserted', count, 'vgcollection');
    // db.games.createIndex({ id: 1 }, { unique: true });
    db.games.createIndex({ title: 1 });

    printjson(db.games.find().toArray());
});
