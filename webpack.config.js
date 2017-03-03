const path = require('path');
const webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                  presets: ['es2015', 'react', 'airbnb']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            },
            { 
                test: /\.css$/, 
                loader: "style-loader!css-loader" 
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "Tether": "tether"
        })
    ],
    resolve: {
      root: [
        path.resolve('./src')
      ]
    },
    entry: {
        bundle: [
            './src/js/main.jsx',
        ]
    },
    output: {
        filename: 'public/[name].js'
    }
};
