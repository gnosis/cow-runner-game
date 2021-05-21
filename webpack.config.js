const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackDefaultConfig = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  devtool: 'inline-source-map'
}

module.exports = [
  {
    ...webpackDefaultConfig,
    name: 'web',
    entry: './src/web.tsx',
    output: {
      filename: 'web.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  }, {
    ...webpackDefaultConfig,
    name: 'lib',
    entry: './src/game/CowGame.tsx',
    output: {
      filename: 'lib.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: []
  }
];