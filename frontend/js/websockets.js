var Sockets = (function() {
  function connect() {
    var d = Q.defer()
    var ws = new WebSocket("ws://localhost:1337/", 'rps');
    ws.onopen = function() {
      d.resolve(ws);
    };

    ws.onerror = function(err) {
      d.reject(err);
    };

    return d.promise;
  }

  return {
    connect: connect
  };
})();

Sockets.connect().then(function(socket) {
  socket.send("HELLO WORLD -- from client");
  socket.onmessage = function(a) {
    console.log(a.data);
  };
}).catch(console.error);