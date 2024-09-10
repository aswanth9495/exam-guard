const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'proctor.js',
    library: {
      name: 'Proctor',
      type: 'umd',
      umdNamedDefine: true,
      export: 'default', // Ensure default export is used
    },
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // HTML Loader (for alert template)
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Extracts CSS into separate files
          'css-loader', // Translates CSS into CommonJS
          'sass-loader', // Compiles Sass to CSS
        ],
        include: path.resolve(__dirname, 'src/assets/styles'),
      },
    ],
  },
  mode: 'production',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    open: false,
  },
};
