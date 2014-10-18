function Conn(ws, ee) {
  this.socket = ws;
  this.emitter = ee;    
  this.playerID = -1;
  this.queue = [];

  var self = this;
  this.socket.onmessage = function(msg) {
    var payload = JSON.parse(msg.data);
    if(payload.evt == 'setid') {
      self.playerID = payload.id;
    }
    self.emitter.emit(payload.evt, payload);
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
  if(this.connected) {
    this.socket.send(msg);
  } else {
    this.queue.push(msg);
  }
};

Conn.prototype.flushQueue = function() {
  var self = this;
  this.queue.forEach(function(msg) {
    self.socket.send(msg);
  });
  this.queue = [];
};

var Sockets = (function() {
  function connect(emitter) {
    var d = Q.defer()
    var ws = new WebSocket("ws://146.148.53.86:1337/", 'rps');
    var conn = new Conn(ws, emitter);

    ws.onopen = function(a) {
      conn.connected = true;
      conn.flushQueue();
      console.log("Successful connection");
    };

    ws.onerror = function(err) {
      console.error(err);
      throw err;
    };

    return conn;
  }

  return {
    connect: connect
  };

})();