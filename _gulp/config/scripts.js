// require("dotenv").config();

var path = require("path");
var webpack = require("webpack-stream").webpack;
var TerserPlugin = require("terser-webpack-plugin");

// UTILS
const deepMerge = require("../utils/deepMerge");

// CONFIG
const paths = require("./common").paths;
const pkg = require("../../package.json");
const themeName = pkg.name;
const dev = process.env.DEV_MODE == "true" ? true : false;

// OUTPUT OBJECT
module.exports = deepMerge({
	paths: {
		watch: [paths.src + "/_includes/js/**/*.{js,jsx}"],
		src: [paths.src + "/_includes/js/**/*.{js,jsx}"],
		dest: paths.build + "/_includes/js/",
		clean: [paths.build + "/_includes/js/**/*.{js,map}"],
	},
	options: {
		webpack: {
			// merged with defaults for :watch task
			watch: {
				mode: "development",
				cache: true,
				watch: true,
				devtool: "source-map",
			},
			// merged with defaults for :dev task
			dev: {
				mode: "development",
				devtool: "source-map",
			},
			// merged with defaults for :prod task
			prod: {
				mode: "production",
				optimization: {
					minimize: true,
					minimizer: [
						new TerserPlugin({
							terserOptions: {
								compress: {
									drop_console: true
								},
								output: {
									comments: false,
								},
							},
							extractComments: false,
						}),
					],
				},
			},
			// defaults
			defaults: {
				resolve: {
					extensions: [".js", ".jsx"],
				},
				output: {
					filename: "[name].[fullhash].js",
				},
				entry: {
					scripts: "./" + paths.src + "/_includes/js/scripts.js",
					// vendor: "./" + paths.src + "/_includes/js/vendor.js",
					// admin: "./_src/_includes/js/admin.js",
				},
				stats: {
					colors: true,
				},
				module: {
					rules: [
						{
							enforce: "pre",
							test: /\.js$/,
							exclude: /node_modules/,
							loader: "eslint-loader",
							options: {
								emitWarning: true,
							},
						},
						{
							test: /\.js$/,
							exclude: /node_modules/,
							loader: "babel-loader",
							options: {
								presets: ["@babel/preset-env"],
								plugins: [
									"@babel/plugin-transform-runtime",
									"@babel/plugin-transform-modules-commonjs",
								],
							},
						},
					],
				},
				plugins: [
					new webpack.ProvidePlugin({
						$: "jquery",
						jQuery: "jquery",
						"window.jQuery": "jquery",
					}),
				],
			},
		},
	},
});
