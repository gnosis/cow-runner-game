const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackDefaultConfig = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  resolve: { extensions: ["*", ".ts", ".tsx"] },
  module: {
    rules: [
      // {
      //   test: /\.(js|jsx)$/,
      //   exclude: /node_modules/,
      //   loader: "babel-loader",
      //   options: { presets: ["@babel/env"] }
      // },
      {
        test: /\.tsx?$/,
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
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  }
}

module.exports = [
  {
    ...webpackDefaultConfig,
    name: 'web',
    entry: './src/web.js',
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
    entry: './src/lib.js',
    output: {
      filename: 'lib.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: []
  }
];