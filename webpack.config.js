const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  target: 'node',
  // entry is where, say, your app starts - it can be called main.ts, index.ts, app.ts, whatever
  entry: ['./src/index.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zellobot2.bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
  },
  watch: {
      ignored: /node_modules/, 
  },
  plugins: [
      new CleanWebpackPlugin(['dist'])
  ]
};