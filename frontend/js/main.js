
Sockets.connect().then(function(connection) {
  SocketConnection = connection;
  requestAnimationFrame(doFrame);
}).done();