var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'proyectoimagenes'
    },
    port: process.env.PORT || 3002,
    db: 'mysql://root@localhost/imagenes'
  },

};

module.exports = config[env];
