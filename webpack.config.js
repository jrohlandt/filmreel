var webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const jsDestinationPath = path.resolve(__dirname, "public", "assets", "js");
module.exports = {
    entry: {
        polyfills: './polyfills.js',
        vendor: [
            'axios',
            'draft-js',
            'draftjs-to-html',
            'qs',
            'react',
            'react-dom',
            'react-draft-wysiwyg',
            'react-router-dom',
        ],
        app: './resources/assets/js/components/admin/app.js',

    },
    plugins: [
        //new webpack.DefinePlugin({
        //    'process.env': {
        //    'NODE_ENV': 'production'
        //}}),
        //new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin([jsDestinationPath]),
        //new webpack.optimize.DedupePlugin(),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            filename: path.resolve(__dirname, 'resources', 'views', 'admin') + '/index.pug',
            template: '!!ejs-loader!./resources/assets/templates/admin/layout.ejs',
            inject: false,
        }),
        new webpack.NamedModulesPlugin(),
        //new UglifyJSPlugin({ breaks stuff
        //    cache: true,
        //    parallel: true,
        //    sourceMap: true
        //})
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true
                },
            }
        },
        runtimeChunk: false
    },
    output: {
        path: jsDestinationPath,
        filename: '[name].[chunkhash].js',
        //chunkFilename: '[name].[chunkhash].bundle.js',
        //filename: '[name].bundle.js',
        //chunkFilename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: {
                    presets: ["env", "react"]
                }
            },
            {
                test: /\.json$/,
                exclude: /(node_modules)/,
                loader: "json-loader"
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
                
                // loader: 'style-loader!css-loader!autoprefixer-loader'
            },
            // {
            //     test: /\.(jpg|png|svg)$/,
            //     loader: 'url-loader',
            //     options: {
            //       limit: 25000,
            //     }
            // }
            // {
            // 	test: /\.scss$/,
            // 	loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
            // }

        ]
    }
}