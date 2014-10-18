function Conn(ws, ee) {
  this.socket = ws;
  this.emitter = ee;    
  this.playerID = -1;

  var self = this;
  this.socket.onmessage = function(msg) {
    var payload = JSON.parse(msg.data);
    console.log('received', payload);
    if(payload.evt == 'setid') {
      self.playerID = payload.id;
    }
    self.emitter.emitEvent(payload.evt, payload.data);
  };
}

Conn.prototype = {};

Conn.prototype.on = function(type, f) {
  return this.emitter.addListener(type, f);
};

Conn.prototype.send = function(type, data) {
  var msg = JSON.stringify({
    evt: type,
    id: this.playerID,
    d: data || {}
  });
  console.log("sending", type, msg);
  this.socket.send(msg);
};

var Sockets = (function() {
  function connect() {
    var d = Q.defer()
    var ws = new WebSocket("ws://128.95.62.197:1337/", 'rps');
    var emitter = new EventEmitter();

    ws.onopen = function(a) {
      console.log("Opened connection");
      var conn = new Conn(ws, emitter);
      conn.send('join');
      conn.on('setid', function() {
        d.resolve(conn);
      });
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

})();