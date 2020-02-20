const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const AddModuleExportsPlugin = require('add-module-exports-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/index'),
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)$/,
        exclude: /node_modules|__tests__/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [new ForkTsCheckerWebpackPlugin(), new AddModuleExportsPlugin()]
}
