import path from 'path';
import webpack from 'webpack';
import CopyWebPackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import BundleAnalyzer from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const config: webpack.Configuration = {
    mode: 'production',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash].bundle.js'
    },
    entry: [
        path.join(__dirname, 'index.tsx'),
        'antd/dist/antd.less',
    ],
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
                                    'primary-color': '#ff254b',
                                    'font-family': 'Helvetica Neue,Segoe UI,helvetica,verdana,sans-serif'
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
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: '/assets/images',
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: '/assets/fonts'
                        }
                    }
                ]
            }
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
        new CopyWebPackPlugin({
            patterns: [
                {from: path.resolve(__dirname, './src/assets/lib/editor'), to: path.resolve(__dirname, './dist/assets/lib/editor')},
                {from: path.resolve(__dirname, './public/favicon.png'), to: path.resolve(__dirname, './dist/favicon.png')},
                {from: path.resolve(__dirname, './public/web.config'), to: path.resolve(__dirname, './dist/web.config')}
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/styles/[name]_[hash].css',
            chunkFilename: 'assets/styles/[id]_[hash].css'
        }),
        new BundleAnalyzer.BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: true,
            reportFilename: 'report.main.html'
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new HtmlWebpackPlugin({
            inject: true,
            alwaysWriteToDisk: true,
            template: path.join(__dirname, 'public/index.html')
        })
    ],
    performance: {
        hints: false
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
    devtool: false
};

export default config;