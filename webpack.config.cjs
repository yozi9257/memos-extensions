const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        background: './src/background/index.ts',
        popup: './src/popup/App.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve('public/manifest.json'), to: path.resolve('dist') },
                { from: path.resolve('LICENSE'), to: path.resolve('dist') },
                { from: 'public/icons', to: path.resolve('dist/icons'), toType: 'dir' },
                { from: 'public/_locales', to: path.resolve('dist/_locales'), toType: 'dir' },
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { 'runtime': 'automatic' }],
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    // 部分依赖使用的是js代码，需要加上.js匹配,  '...' 为默认配置，包含了'.js',
    resolve: {
        extensions: ['.ts', '.tsx', '...']
    }
};