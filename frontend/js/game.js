
function Game() {
  function forEach(f, thisVal) {
    for(var k in this) {
      if(k !== 'forEach')
        f.call(thisVal, this[k], k, this);
    }
  }
  this._players = {};
  this._players.forEach = forEach;
  this._projectiles = {};
  this._projectiles.forEach = forEach;

  this._eventStream = new EventEmitter();
}

Game.prototype.start = function() {
  var self = this;

  //start a connection to the socket server.
  var socket = Sockets.connect(self);
  socket.send("join");

  //start the rendering loop.
  requestAnimationFrame(startRenderCycle.bind(null, self));

  //start game ticks
  setInterval(function() {
    self.player().sendMessage(socket);
  }, 100);

  //Initialize key presses
  keysSetGame(self);

  //Movement Events
  self.on('stopU', function() {
    self.player().send()
  });

  self.on('moveL', function() {
    self.player().accelerate(-100, 0);
  });

  self.on('moveR', function() {
    self.player().accelerate(100, 0);
  })

  self.on('moveU', function() {
    self.player().accelerate(0, -100);
  });

  self.on('moveD', function() {
    self.player().accelerate(0, 100);
  });

  //Key presses
  self.on('fireU', function() {
    socket.send('directional', {
      dir: 'u', x: self.player().x, y: self.player().y
    });
  });

  self.on('fireD', function() {
    socket.send('directional', {
      dir: 'd', x: self.player().x, y: self.player().y
    });
  });

  self.on('fireL', function() {
    socket.send('directional', {
      dir: 'l', x: self.player().x, y: self.player().y
    });
  });

  self.on('fireR', function() {
    socket.send('directional', {
      dir: 'r', x: self.player().x, y: self.player().y
    });
  });

  self.on('special', function() {
    socket.send('special', {
      x: self.player().x, y: self.player().y
    });
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
    if(msg.id != self._playerID) {
      player.setPosition(msg.d.x, msg.d.y);
      player.setVelocity(msg.d.vx, msg.d.vy);
    }
    player.setType(msg.d.type);
    player.setHealth(msg.h);
  });

  self.on('playerdisconnect', function(msg) {
    self.removePlayer(msg.id);
  });

  self.on('melee', function(msg) {
    self.player(msg.id).startMelee(msg.dir);
  });

  self.on('projectile', function(msg) {
    var projectile = self.projectile(msg.d.projectileid);
    projectile.setPosition(msg.d.x, msg.d.y);
    projectile.setVelocity(msg.d.vx, msg.d.vy);
    projectile.setType(msg.d.type);
  });

  self.on('areaattack', function(msg) {

  });
};

Game.prototype.projectile = function(id) {
  return this._projectiles[id] || (this._projectiles[id] = new Projectile());
};

Game.prototype.projectiles = function() {
  return this._projectiles;
};

Game.prototype.player = function(id) {
  if(id == null) {
    if(this._playerID != null) {
      return this._players[this._playerID];
    } else {
      console.log("Player not connected yet!");
      function noop(){}
      return {doPlayerFrame: noop, sendMessage: noop};
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