const path = require('path');

module.exports = {
    mode: 'development',
    // entry: { app: './src/App.jsx' }, // Non-HMR
    entry: { app: ['./browser/App.jsx'] }, // Hot Module Replacement
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
        publicPath: '/', // This param added for Browser History Router, not needed for Hash Raouter
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'all',
        },
    },
    // Debug tool -- see source code instead of compiled code
    // Dev console > sources > webpack > . > [source files]
    devtool: 'source-map',
};
