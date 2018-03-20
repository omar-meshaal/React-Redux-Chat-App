require('babel-core/register');
if (process.env.NODE_ENV !== 'production') {
  require('./server.dev');
} else {
  require('./server.prod')
}
