const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')

// eslint-disable-next-line arrow-parens
module.exports = arg => {
	const isProduction = arg === 'production'
	const isDevelopment = !isProduction
	return {
		mode: arg,
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
		watch: isDevelopment,
	}
}
