var Sockets = (function() {
  function connect() {
    var d = Q.defer()
    var ws = new Websocket("ws://localhost:8080/", 'rps');
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
    console.log(a);
  };
});