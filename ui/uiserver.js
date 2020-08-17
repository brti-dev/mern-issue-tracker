require('dotenv').config()
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware') // Not implemented
const app = express()

app.use(express.static('public'))

// Proxy Not implemented -- for reference only
const apiProxyTarget = process.env.API_PROXY_TARGET
if (apiProxyTarget) {
    app.use('/graphql', createProxyMiddleware({ target: apiProxyTarget }))
}

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT
const env = { UI_API_ENDPOINT }

// Make a route to give browser access to env
app.get('/env.js', function(req, res) {
    res.send(`window.ENV = ${JSON.stringify(env)}`)
})

const port = process.env.UI_SERVER_PORT || 8000

app.listen(port, function() {
    console.log('UI started on port', port)
})
