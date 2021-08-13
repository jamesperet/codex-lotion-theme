const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'views/files'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.js$/,
            loader: 'babel-loader'
          },
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ]
      },
      plugins: [
        new VueLoaderPlugin()
      ]
  };
  