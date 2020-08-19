require('dotenv').config();
const express = require('express');
const { connectToDb } = require('./db');
const { installHandler } = require('./api_handler');

const app = express();
installHandler(app);

const port = process.env.API_SERVER_PORT || 3000;

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
