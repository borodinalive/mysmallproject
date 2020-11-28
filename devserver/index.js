module.exports = function setupDevServer(app, templatePath, cb) {
  let bundle; let template; let clientManifest; let ready;

  const readyPromise = new Promise((r) => {
    ready = r;
  });
  const update = () => {
    if (bundle) {
      ready();
      cb(bundle, {
        template,
        clientManifest,
      });
    }
  };

  // read template from disk and watch
  template = fs.readFileSync(templatePath, 'utf-8');
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8');
    console.log('index.html template updated.');
    update();
  });

  // Watcher для client/index.js
  clientConfig.entry['client/index'] = ['webpack-hot-middleware/client', clientConfig.entry['client/index']];
  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  // dev middleware
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
    stats: {
      colors: true,
      chunks: false,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  });
  app.use(devMiddleware);

  clientCompiler.plugin('done', (stats) => {
    stats = stats.toJson();
    stats.errors.forEach((err) => console.error(err));
    stats.warnings.forEach((err) => console.warn(err));
    // if (stats.errors.length) return
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'client-manifest.json'
    ));
    update();
  });

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler, {
    reload: true, heartbeat: 2000, log: () => {
    },
  }));

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
    update();
  });

  return readyPromise;
};
