'use strict';

const Hapi = require('hapi');
require('./app/models/db');

let server = new Hapi.Server();

server.connection({ port: process.env.PORT || 4000 });

const initUser = {
    admin: {
      email: 'admin',
      firstName: 'Initial',
      lastName: 'Administrator',
      password: '1234',
    },
  };

server.register([require('inert'), require('vision'), require('hapi-auth-cookie')], err => {

  if (err) {
    throw err;
  }

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'donation-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/login',
  });

  server.auth.default({
    strategy: 'standard',
  });

  server.route(require('./routes'));
  server.start((err) => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});
