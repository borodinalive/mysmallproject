const Vue = require('vue')
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const renderer = require('vue-server-renderer').createRenderer()

const app = express();
const config = require('./config/webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.get('/', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `
      <div>Вы открыли URL: {{ url }}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Внутренняя ошибка сервера')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
        <meta charset="utf-8">
        <title>Привет</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
