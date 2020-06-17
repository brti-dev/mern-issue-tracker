const express = require('express')

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

// Start the server and wait for requests
/**
 * @param port Listen on this port
 * @param callback Call when server has successfully started
 */
app.listen(3000, function() {
    console.log('App started on port 3000')
})