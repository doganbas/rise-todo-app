import path from 'path';
import webpack from 'webpack';
import CopyWebPackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import webpackDevServer from 'webpack-dev-server';

const config: webpack.Configuration = {
    mode: 'development',
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'src'),
        filename: '[name].[chunkhash].bundle.js'
    },
    entry: path.join(__dirname, 'index.tsx'),
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    'primary-color': '#ff254b'
                                },
                                javascriptEnabled: true,
                            },
                        },
                    }
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name() {
                            return '[path][name].[ext]';
                        }
                    }
                }]
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {
            globalize$: path.resolve(__dirname, 'node_modules/globalize/dist/globalize.js'),
            globalize: path.resolve(__dirname, 'node_modules/globalize/dist/globalize'),
            cldr$: path.resolve(__dirname, 'node_modules/cldrjs/dist/cldr.js'),
            cldr: path.resolve(__dirname, 'node_modules/cldrjs/dist/cldr')
        },
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: path.join(__dirname, 'lib', 'vendor_manifest.json')
        }),
        new HtmlWebpackPlugin({
            inject: true,
            alwaysWriteToDisk: true,
            template: path.join(__dirname, 'public/index.html')
        }),
        new AddAssetHtmlPlugin([
            {filepath: path.resolve('./**/*.bundle.js')},
            {filepath: path.resolve('./lib/*.bundle.css'), typeOfAsset: 'css'}
        ]),
        new CopyWebPackPlugin({
            patterns: [
                {from: 'public/favicon.png', to: 'favicon.png'}
            ]
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ErrorOverlayPlugin()
    ],
    devServer: {
        historyApiFallback: true,
        port: 4000,
        open: true,
        hot: true
    },
    devtool: 'source-map'
};

export default config;