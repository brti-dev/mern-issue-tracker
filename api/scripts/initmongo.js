/*
* Run using the mongo shell. For remote databases, ensure that the
* connection string is supplied in the command line. For example:
* localhost:
* mongo issuetracker scripts/initmongo.js
* Atlas:
* mongo <db_url> scripts/init.mongo.js
* MLab:
* mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
*/

/* global db print */
/* eslint no-restricted-globals: "off" */

db.issues.remove({});
const issuesDB = [
    {
        id: 1,
        status: 'New',
        owner: 'Ravan',
        effort: 5,
        created: new Date('2019-01-15'),
        due: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Eddie',
        effort: 14,
        created: new Date('2019-01-16'),
        due: new Date('2019-02-01'),
        title: 'Missing bottom border on panel',
    },
];
db.issues.insertMany(issuesDB);
const count = db.issues.count();
print('Inserted', count, 'issues');

// Track number of issues in the `counters` collection
db.counters.remove({ _id: 'issues' });
db.counters.insert({ _id: 'issues', current: count });

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ status: 1 });
db.issues.createIndex({ owner: 1 });
db.issues.createIndex({ created: 1 });
