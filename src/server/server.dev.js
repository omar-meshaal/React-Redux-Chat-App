'use strict';

import express from 'express';
import path from 'path';
import SocketIo from 'socket.io';
import mongoose from 'mongoose';
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import React from 'react';
import createHistory from 'history/createMemoryHistory'
import webpack from 'webpack';
import { RouterContext, match } from 'react-router';
import cors from 'cors';

import configureStore from '../common/store/configureStore'
import routes from '../common/routes';
import webpackConfig from '../../webpack.config.dev'
import User from './models/User.js';

const dotenv = require('dotenv');
dotenv.config();

const MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/chat_dev';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGOLAB_URI);

process.on('uncaughtException', function (err) {
  console.log(err);
});
const compiler = webpack(webpackConfig);

const app = express();
app.use(cors());
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

const messageRouter = express.Router();
const usersRouter = express.Router();
const channelRouter = express.Router();
require('./routes/message_routes')(messageRouter);
require('./routes/channel_routes')(channelRouter);
require('./routes/user_routes')(usersRouter);
app.use('/api', messageRouter);
app.use('/api', usersRouter);
app.use('/api', channelRouter);

app.use('/', express.static(path.join(__dirname, '..', 'static')));

app.get('/*', function(req, res) {
  const history = createHistory()
  const location = history.location
  match({ routes, location }, (err, redirectLocation, renderProps) => {

    const initialState = {
      auth: {
        user: {
          username: 'tester123',
          id: 0,
          socketID: null
        },
        signInError: null

      }
    }
    const store = configureStore(initialState);
   
    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!renderProps) {
      return res.status(404).end('Not found');
    }
    const InitialView = (
      <Provider className="root" store={store}>
        <div style={{height: '100%'}}>
          <RouterContext {...renderProps} />
        </div>
      </Provider>
    );

    const finalState = store.getState();
    const html = renderToString(InitialView)
    res.status(200).end(renderFullPage(html, finalState));
  })
})

const server = app.listen(PORT, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('server listening on port: %s', PORT);
});

const io = new SocketIo(server, {path: '/api/chat'})
const socketEvents = require('./socketEvents')(io);

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
        <link rel="icon" href="./favicon.ico" type="image/x-icon" />
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <title>React Redux Socket.io Chat</title>
      </head>
      <body>
        <container id="react">${html}</container>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `
}
