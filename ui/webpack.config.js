const path = require('path');

module.exports = {
    mode: 'development',
    // entry: { app: './src/App.jsx' }, // Non-HMR
    entry: { app: ['./src/App.jsx'] }, // Hot Module Replacement
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
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
};
