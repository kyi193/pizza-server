/* eslint no-console: 0 */
const queryHelper = require('./src/queryHelper')
const detailedRestaurantQueryHelper = require('./src/detailedRestaurantQueryHelper')
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const { query } = require('express');
const cors = require('cors');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT;
const app = express();

app.use(cors());

app.get('/api/getRestaurants/:zipCode', function (req, res) {
  const zipCode = req.params.zipCode
  queryHelper(zipCode)
    .then(result => {
      const { data, errors, extensions } = result;
      res.json(data)
      //GraphQL errors and extensions are optional
    })
    .catch(error => {
      console.log("Error", error)
    });
})

app.get('/api/detailedPage/:id', function (req, res) {
  const id = req.params.id
  detailedRestaurantQueryHelper(id)
    .then(result => {
      const { data, errors, extensions } = result;
      res.json(data)
      //GraphQL errors and extensions are optional
    })
    .catch(error => {
      console.log("Error", error)
    });
})

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
