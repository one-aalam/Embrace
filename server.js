var Server = require('./lib/express');

module.exports = Server.start({
  db:false,
  socket:true,
  secure:false
});
