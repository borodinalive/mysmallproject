const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const express = require('express');

const vueRenderer = require('vue-server-renderer');

const server = express();

const templatePath = path.resolve(__dirname, 'html-templates/index.template.html');

const template = fs.readFileSync(templatePath, 'utf-8');

// const isProd = (process.env.NODE_ENV === 'production');

const resolve = (file) => path.resolve(__dirname, file);

const appConf = {}; // require('./env.conf.js');

/* eslint-disable no-console */
const clientManifest = require('../../dist/client-manifest.json');
const bundle = require('../../dist/vue-ssr-server-bundle.json');

function createRenderer(bundle, options) {
  return vueRenderer.createBundleRenderer(bundle, Object.assign(options, {
    cache: new LRU({
      max: 10000,
      maxAge: 1000 * 60 * 60,
    }),
    basedir: resolve('../../dist'),
    runInNewContext: 'once',
    clientManifest,
  }));
}

let renderer = null;
let readyPromise = null;

if (appConf.ENV === 'production') {
  renderer = createRenderer(bundle, {
    template,
  });
} else {
  readyPromise = require(resolve('../../devserver'))(
    server,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  );
}

const handleError = (err, res, req) => {
  // Render Error Page or Redirect
  if (err.url) {
    res.redirect(err.url);
  } else if (err.code === 404) {
    res.status(404).send('404 | Page Not Found');
  } else {
    console.error('error during render', err.stack);
    res.status(500).send('500 | Internal Server Error');
  }
};

function render(req, res) {
  const context = {
    req,
    res,
    title: 'Vue SSR app',
    url: req.raw.url,
  };
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err, res, req);
    }
    res
      .code(200)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(html);
  });
}

// Forward all get requests to renderer
server.get('*', (req, res) => {
  if (true /* appConf.ENV === 'development'*/) { // todo
    readyPromise.then(() => render(req, res)).catch((err) => console.error(err));
  } else {
    render(req, res);
  }
});

server.listen(3000, (err, addr) => {
  if (err) {
    server.log.error(err);
    throw err;
  }
  console.log(`SSR listening on ${addr}`);
});
