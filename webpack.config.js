require('dotenv').config();

const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const pkg = require("./package.json");

const themeName = pkg.name;
const dev = ( process.env.DEV_MODE == "true" ) ? true : false;

module.exports = {
  mode: dev ? "development" : "production",
  devtool: dev ? "source-map" : "none",
  entry: {
    sssfaliveapi: "./_src/_includes/js/scripts.js",
  },
  output: {
    filename: "[name].[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  plugins: [
    new TerserPlugin({
      cache: true,
      parallel: true,
      terserOptions: {
        compress: {
          drop_console: dev ? false : true
        }
      }
    })
  ],
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  }
};
