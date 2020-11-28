const webpack = require('webpack');
const {merge} = require('webpack-merge');

const path = require('path');
const fs = require('fs');

const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const BASE_CONFIG = require('./webpack.base.config.js');

const webpackExternals = [];
const webpackPlugins = [];

const styleLoader = [
  'vue-style-loader',
  'css-loader',
  'postcss-loader',
  // {
  //   loader: 'sass-loader',
  //   options: {
  //     data: Object.keys(sassVars).map(key => '$' + key + ": " + '"' + sassVars[key] + '";').join(" "),
  //   }
  // },
  // {
  //   loader: 'sass-resources-loader',
  //   options: {
  //     resources: sassRecources
  //   }
  // },
];

// Map node_modules support as webpack externals array for TARGET=node
const nodeModules = {};

fs.readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((m) => {
    nodeModules[m] = 'commonjs ' + m;
  });
nodeModules['fs'] = 'commonjs fs';
webpackExternals.push(nodeModules);

module.exports = merge(BASE_CONFIG, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            hotReload: true, // todo
            loaders: {
              js: 'babel-loader',
              css: styleLoader,
            },
          },
        },
      },
      // {
      //   test: /\.scss$/,
      //   use: styleLoader
      // },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:16].[ext]',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000',
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-sprite-loader',
      //   options: {
      //     symbolId: filePath => path.basename(filePath)
      //   }
      // }
    ],
  },
  target: 'node',
  externals: webpackExternals,
  entry: {
    'server/index': './src/server/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'), // todo
    publicPath: '/', // todo
    libraryTarget: 'commonjs2',
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'appConf': JSON.stringify(appConf),
    //   "process.env.VUE_ENV": "'server'"
    // }),
    new VueSSRServerPlugin(),
  ],
});
