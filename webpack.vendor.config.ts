import path from 'path';
import webpack from 'webpack';
import BundleAnalyzer from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

const config: webpack.Configuration = {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    'primary-color': '#5A54FF'
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
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: 'url-loader?name=[name].[ext]'
                }, {
                    loader: ImageMinimizerPlugin.loader
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'url-loader?name=[name].[ext]'
                }]
            }
        ]
    },
    output: {
        path: path.join(__dirname, 'lib'),
        filename: 'vendor.[chunkhash].bundle.js',
        chunkFilename: 'vendor.[chunkhash].bundle.js',
        library: 'vendor_lib'
    },
    entry: {
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'react-router-dom',
            'redux',
            'redux-persist',
            'redux-persist/lib/storage',
            'redux-thunk',
            'history',
            'react-redux',
            'redux-logger',
            'axios',
            'moment',
            'antd',
            '@ant-design/icons',
            'i18next',
            'react-i18next',
            'react-helmet',
            'antd/dist/antd.less'
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            name: 'vendor_lib',
            path: path.join(__dirname, 'lib', 'vendor_manifest.json')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].bundle.css',
            chunkFilename: 'lib/[name].[chunkhash].bundle.css'
        }),
        new BundleAnalyzer.BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: true,
            reportFilename: 'report.vendor.html'
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
    devtool: 'source-map'
}

export default config;