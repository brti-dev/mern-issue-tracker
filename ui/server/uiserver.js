require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware'); // Not implemented
const path = require('path');

const render = require('./render.js');

const app = express();

// Hot Module Replacement
// Browser refresh upon frontend changes
const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';
if (enableHMR && (process.env.NODE_ENV !== 'production')) {
    console.log('Adding dev middleware, enabling HMR');
    /* eslint "global-require": "off" */
    /* eslint "import/no-extraneous-dependencies": "off" */
    const webpack = require('webpack');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack.config.js');
    config.entry.app.push('webpack-hot-middleware/client');
    config.plugins = config.plugins || [];
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    const compiler = webpack(config);
    app.use(devMiddleware(compiler));
    app.use(hotMiddleware(compiler));
}

app.use(express.static('public'));

// Proxy Not implemented -- for reference only
const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
    app.use('/graphql', createProxyMiddleware({ target: apiProxyTarget }));
}

const { UI_API_ENDPOINT } = process.env;
const env = { UI_API_ENDPOINT };

// Make a route to give browser access to env
app.get('/env.js', (req, res) => {
    res.send(`window.ENV = ${JSON.stringify(env)}`);
});

app.get('/about', render);

// Respond with index.html for all requests
app.get('*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('UI started on port', port);
});
