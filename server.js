const Vue = require('vue')
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./src/templates/index.template.html', 'utf-8')
})

const app = express();
const createApp = require('./src/index');
const config = require('./config/webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.get('/', (req, res) => {
  const context = { url: 'корень сайта' }
  const app = createApp(context)

  renderer.renderToString(app, (err, html) => {
    res.send(html);
  })
})

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
