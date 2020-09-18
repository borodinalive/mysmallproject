const Vue = require('vue')
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

let templateHtmlFile = require('fs').readFileSync('./src/templates/index.template.html', 'utf-8');
// const renderer = require('vue-server-renderer').createRenderer({
//   template: templateHtmlFile
// })

const { createBundleRenderer } = require('vue-server-renderer')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: templateHtmlFile,
  // clientManifest // (опционально) манифест клиентской сборки
})

const app = express();
// const createApp = require('./src/index');
const createApp = require('/path/to/built-server-bundle.js')
const config = require('./config/webpack.base.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.get('*', (req, res) => {
  const context = { url: req.url }

  createApp(context).then(app => {
    renderer.renderToString(app, (err, html) => {
      if (err) {
        if (err.code === 404) {
          res.status(404).end('Страница не найдена')
        } else {
          res.status(500).end('Внутренняя ошибка сервера')
        }
      } else {
        res.end(html)
      }
    })
  })
})

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
