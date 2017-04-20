var webpack = require('webpack');

var config = {
    entry: './src/index.js',

    output: {
        path: './',
        filename: 'index.js',
    },

    devServer: {
        inline: true,
        port: 8083,
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                secure: false
            }
        }
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',

                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}

module.exports = config;