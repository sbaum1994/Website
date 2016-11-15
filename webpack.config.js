const path = require('path');
const webpack = require('webpack');

function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') {
        sources.push('webpack-dev-server/client?http://localhost:8080');
    }

    return sources;
}
// production mode will not run the dev webserver ^
// still will need to update cdn to point to public for production
// in advanced work you use a templating engine and store as a variable
// the path to the cdn based on the node env
// loaders can be regex, they just say hey any js load through jsx loader
// babel react doesn't need a jsx loader to be separate anymore fyi
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
        helloWorld: getEntrySources([
            './src/js/helloworld.jsx',
        ])
    },
    output: {
        filename: 'public/[name].js'
    }
};
