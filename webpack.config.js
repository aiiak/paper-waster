const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ProvidePlugin } = require('webpack');

module.exports = (env, { mode = 'development' }) => {
    const config = {
        mode,
        entry: {
            app: './src/index.tsx'
        },
        devtool: '',
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: 'ts-loader'
                },
                {
                    test: /\.scss$/,
                    loader: 'style-loader!css-loader!sass-loader'
                }
            ]
        },
        plugins: [
            new ProvidePlugin({
                _: 'lodash'
            })
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',
            libraryTarget: 'umd',
            publicPath: '/dist/',
            umdNamedDefine: true
        },
        optimization: {
            mangleWasmImports: true,
            mergeDuplicateChunks: true,
            minimize: true,
            nodeEnv: 'production'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            })
        ]
    };

    /**
     * If in development mode adjust the config accordingly
     */
    if (mode === 'development') {
        config.devtool = 'source-map';
        config.output = {
            filename: '[name]/index.js'
        };
        config.module.rules.push({
            loader: 'source-map-loader',
            test: /\.js$/,
            exclude: /node_modules/,
            enforce: 'pre'
        });
        config.plugins = [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"development"'
            }),
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, 'dist/index.html'),
                template: path.resolve(__dirname, 'src', 'index.html')
            }),
            new webpack.HotModuleReplacementPlugin(),
            new ProvidePlugin({
                _: 'lodash'
            })
        ];
        config.devServer = {
            contentBase: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            stats: {
                colors: true,
                hash: false,
                version: false,
                timings: true,
                assets: true,
                chunks: false,
                modules: false,
                reasons: false,
                children: false,
                source: false,
                errors: true,
                errorDetails: true,
                warnings: false,
                publicPath: false
            }
        };
        config.optimization = {
            mangleWasmImports: true,
            mergeDuplicateChunks: true,
            minimize: false,
            nodeEnv: 'development'
        };
    }
    return config;
};
