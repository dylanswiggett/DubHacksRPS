
function Game() {
  this._players = {};
  this._players.forEach = function(f, thisVal) {
    for(var k in this) {
      f.call(thisVal, this[k], k, this);
    }
  };

  this._eventStream = new EventEmitter();
}

Game.prototype.start = function() {
  var self = this;

  //start a connection to the socket server.
  var socket = Sockets.connect(self);
  socket.send("join");

  //start the rendering loop.
  requestAnimationFrame(startRenderCycle.bind(null, self));

  //Movement Events
  self.on('moveL', function() {
    self.player().move(-1, 0);
  });

  self.on('moveR', function() {
    self.player().move(1, 0);
  })

  self.on('moveU', function() {
    self.player().move(0, -1);
  });

  self.on('moveD', function() {
    self.player().move(0, 1);
  });

  self.on('arenainit', function(msg) {
    self.setBounds(msg.d.w, msg.d.h);
  });

  self.on('arenaobject', function(msg) {
    console.log('object', msg);
  });

  self.on('setid', function(msg) {
    console.log('setid', msg);
    self.setPlayerID(msg.id)
    var player = self.player(msg.id);
    player.setPosition(msg.d.x, msg.d.y);
    player.setType(msg.d.type);
    player.setHealth(msg.h);
  });

  self.on('p', function(msg) {
    var player = self.player(msg.id);
    if(msg.id != self._playerID) player.setPosition(msg.d.x, msg.d.y);
    player.setType(msg.d.type);
    player.setHealth(msg.h);
  });
};

Game.prototype.player = function(id) {
  if(id == null) {
    if(this._playerID != null) {
      return this._players[this._playerID];
    } else {
      throw new Error("Player is not in game yet.")
    }
  }
  return this._players[id] || (this._players[id] = new Player());
};

Game.prototype.removePlayer = function(id) {
  delete this._players[id];
};

Game.prototype.players = function() {
  return this._players;
};

Game.prototype.setPlayerID = function(id) {
  this._playerID = id;
};

Game.prototype.setBounds = function() {

};

Game.prototype.emit = function(type, data) {
  this._eventStream.emit(type, data);
  return this;
};

Game.prototype.on = function(type, f) {
  this._eventStream.addListener(type, f);
  return this;
};