const webpack = require('webpack');
const {merge} = require('webpack-merge');

const path = require('path');

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

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

// Forward config into application
// webpackPlugins.push(
//   new webpack.DefinePlugin({
//     'appConf': JSON.stringify(appConf),
//     "process.env.VUE_ENV": "'client'"
//   })
// )
//
// if(appConf.ENV === 'production') {
//   webpackPlugins.push(new BundleAnalyzerPlugin({
//     analyzerMode: 'static',
//     openAnalyzer: false,
//     logLevel: 'warn',
//     generateStatsFile: true,
//     statsFilename: 'webpack-stats.json'
//   }));
// }

webpackPlugins.push(new VueSSRClientPlugin({
  filename: 'client-manifest.json',
}));

module.exports = merge(BASE_CONFIG, {
  entry: {
    'client/index': path.resolve(__dirname, '../src/client/index.js'),
  },
  mode: 'development',
  target: 'web',
  externals: webpackExternals,
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js?' + Date.now(),
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            hotReload: true,
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
        exclude: /(node_modules)/,
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
      //     symbolId: filePath => path.basename(filePath),
      //     publicPath: '/'
      //   }
      // },
    ],
  },
  plugins: webpackPlugins,
});
