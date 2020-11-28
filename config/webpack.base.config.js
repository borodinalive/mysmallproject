const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: {
    all: false,
    colors: true,
    hash: true,
    timings: true,
    assets: false,
    chunks: true,
    chunkOrigins: false,
    chunkModules: false,
    modules: false,
    children: false,
  },
  optimization: {
    runtimeChunk: false,
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new webpack.ProvidePlugin({
      "Vue": 'vue',
      "Vuex": ['vuex/dist/vuex.esm.js', 'default'],
      "mapState": ['vuex/dist/vuex.esm.js', 'mapState'],
      "mapGetters": ['vuex/dist/vuex.esm.js', 'mapGetters'],
      "mapMutations": ['vuex/dist/vuex.esm.js', 'mapMutations'],
      "mapActions": ['vuex/dist/vuex.esm.js', 'mapActions'],
      "_": ['@client/lib/lodash.js', 'default']
    }),
    new VueLoaderPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from:'src/assets/favicon',
    //     to:'assets/favicon'
    //   }
    // ]),
  ],
};
