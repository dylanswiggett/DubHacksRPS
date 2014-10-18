var Sockets = (function() {
  function connect() {
    var d = Q.defer()
    var ws = new WebSocket("ws://128.95.62.197:1337/", 'rps');
    var emitter = new EventEmitter();

    ws.onopen = function(a) {
      d.resolve(new Connection(ws, emitter));
    };

    ws.onerror = function(err) {
      d.reject(err);
      console.error(err);
    };

    return d.promise;
  }

  return {
    connect: connect
  };

  function Connection(ws, ee) {
    this.playerID = -1;
    var self = this;
    this.socket.onmessage = function(msg) {
      var payload = JSON.parse(msg.data);
      if(typeof payload.id == 'Number') {
        self.playerID = payload.id;
      }
      this.emitter.emitEvent(payload.evt, payload.data);
    };
    this.socket = ws;
    this.emitter = ee;
  }

  Connection.prototype.on = function(type, f) {
    return this.emitter.addListener(type, f);
  };

  Connection.prototype.send(type, data) {
    this.socket.send(JSON.stringify({
      evt: type,
      id: this.playerID,
      d: data || null
    }));
  };

})();



Sockets.connect().then(function(connection) {
  connection.send('join');
}).catch(console.error);