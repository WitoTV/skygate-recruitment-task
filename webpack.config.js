const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 

module.exports = {
	'context': path.resolve(__dirname, 'src'),
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000
	},
	'plugins': [
		new MiniCssExtractPlugin({
			'filename': 'css/style.css',
			'chunkFilename': 'css/[name].css'
		}),
		new HtmlWebPackPlugin({
			template: "./index.html",
			filename: "./index.html"
		})
	],
	'entry': {
		'app': './js/app.jsx'
	},
	'output': {
		'path': path.resolve(__dirname, 'dist'),
		'filename': 'js/[name].js',
		'publicPath': '/'
	},
	'module': {
		'rules': [
			{
				test: /\.html$/,
				use: [
				{
					loader: "html-loader",
					options: {minimize: true}
				}
				]
			},
			{
				'test': /\.(sass|scss)$/,
				'exclude': /node_modules/,
				'use': [
					{
						'loader':  MiniCssExtractPlugin.loader,
					},
					{
						'loader': 'css-loader',
						'options': {
							'url': false,
							'importLoader': 2
						}
					},
					{
						'loader': 'postcss-loader',
						'options': {
							'ident': 'postcss',
							'plugins': () => [
								require('autoprefixer')()
							]
						}
					},
					'sass-loader'
				]
			},
			{
				'test': /\.(js|jsx)$/,
				'exclude': /node_modules/,
				'use': [
					{
						'loader': 'babel-loader',
					}
				]
			}
		]
	},
	'resolve': {
		'extensions': ['.js', '.jsx', '.json', '.scss', '.css'],
		'alias': {
			'scss': path.resolve(__dirname, 'src/scss/'),
		}
	},
	'optimization': {
		'namedModules': true,
		'splitChunks': {
			'cacheGroups': {
				'default': false,
				'commons': {
					'test': /[\\/]node_modules[\\/]/,
					'name': 'vendor',
					'chunks': 'all'
				},
				'style': {
					'test': /\.(sass|scss|css)$/,
					'name': 'style', 
					'minChunks': 1,
					'reuseExistingChunk': true,
					'enforce': true
				}
			}
		}
	}
}