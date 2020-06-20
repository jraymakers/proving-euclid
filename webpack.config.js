var path = require('path');

module.exports = {
  entry: './src/entry/main.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              silent: true,
            }
          }
        ]
      },
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'out')
  },
  resolve: {
    extensions: ['.tsx', '.js']
  },
  stats: 'errors-only',
};