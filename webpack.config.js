const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')

module.exports = {
	mode: 'development',
	entry: {
		index: path.resolve(__dirname, './src/index.js'),
	},
	output: {
		path: path.resolve(__dirname, './'),
		filename: 'build/[name].budle.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './src/template.html'),
		}),
		new HtmlWebpackInlineSVGPlugin({
			runPreEmit: true,
			inlineAll: true,
		}),
	],

	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.svg$/,
				type: 'asset/source',
			},
		],
	},
	watch: true,
}
