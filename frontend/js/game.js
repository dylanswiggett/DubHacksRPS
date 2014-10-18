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
  this._images = {};
  this._walls = [];

  this._eventStream = new EventEmitter();
}

var serverTimeDelta = 0;
function currentServerTime() {
  return Date.now() - serverTimeDelta;
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

  setInterval(function() {
    socket.send("t", {t:+Date.now()});
  }, 1000);

  //Tell key presses about game.
  keysSetGame(self);

  var min_rtt = 1e99;
  self.on('sync', function(msg) { 
    var now = Date.now();
    var rtt = now - msg.d.you;
    if(rtt < min_rtt) {
      min_rtt = rtt;
      var bestServerTime = msg.d.me + rtt / 2;
      serverTimeDelta = now - bestServerTime;
      console.log("new min_rtt", rtt, serverTimeDelta);
    }
  });

  self.on('playertypes', function(msg) {
    setPlayerTypes(msg.d);
  });

  self.on('playermetainfo', function(msg) {
    var pmi = msg.d;
    setPlayerMetaInfo(pmi);

    var typeSelector = document.getElementById('type-selector')

    function setClasses(type) {
      return function(e) {
        var playerTypes = getPlayerTypes();
        if(playerTypes) {
          Array.prototype.slice.call(e.target.parentNode.children, 0).forEach(function(child) {
            var interaction = playerTypes[type][child.getAttribute('alt')]
            child.className = 'int'+interaction;
          });
        }
      }
    }

    function removeClasses() {
      Array.prototype.slice.call(typeSelector.children, 0).forEach(function(child) {
        child.className = '';
      })
    }

    Object.keys(pmi).forEach(function(type) {
      var el = document.createElement('img');
      el.setAttribute('width', 48);
      el.setAttribute('height', 48);
      el.setAttribute('src', "assets/textures/players/"+type+".png")
      el.setAttribute('alt', type);
      el.setAttribute('id', 'img-'+type);
      el.setAttribute('title', type);
      el.onmouseover = setClasses(type);
      el.onmouseout = removeClasses;
      el.onclick = function(e) {
        if(self.player().type === 'dead')
          self.player().setType(e.target.getAttribute('alt'))
      }
      self._images[type] = el;
      if(pmi[type].Object === 'Player')
        typeSelector.appendChild(el);
    });
  });

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

  self.on('projhit', function(msg) {
    console.log('ph');
    var id = msg.id;
    if(id == -1) {
      //TODO: PARTICLES EVERYWHERE!
    } else {
      var player = game.player(id);
      player.hurt();
    }

    self.removeProjectile(msg.d.projectileid);
  });

  self.on('meleehit', function(msg) {
    var player = game.player(msg.id);
    player.hurt();
  });

  self.on('arenainit', function(msg) {
    self.setBounds(msg.d.w, msg.d.h);
  });

  self.on('arenaobject', function(msg) {
    self._walls.push(new Wall(msg.d.x, msg.d.y, msg.d.w, msg.d.h));
  });

  self.on('setid', function(msg) {
    console.log('setid', msg);
    self.setPlayerID(msg.id)
    var player = self.player(msg.id);
    player.setPosition(msg.d.x, msg.d.y);
    player.setType(msg.d.type);
    player.setHealth(msg.d.h);
  });

  self.on('dead', function(msg) {
    self.player(msg.id).setType('dead');
  });

  self.on('p', function(msg) {
    var player = self.player(msg.id);
    if(msg.id != self._playerID) {
      player.setPosition(msg.d.x, msg.d.y);
      player.setVelocity(msg.d.vx, msg.d.vy);
      player.setType(msg.d.type);
    }
    player.setHealth(msg.d.h);
  });

  self.on('playerdisconnect', function(msg) {
    self.removePlayer(msg.id);
  });

  self.on('melee', function(msg) {
    self.player(msg.id).startMelee(msg.d.dir);
  });

  self.on('projectile', function(msg) {
    var projectile = self.projectile(msg.d.projectileid);
    projectile.setPosition(msg.d.x, msg.d.y);
    projectile.setVelocity(msg.d.vx, msg.d.vy);
    projectile.setType(msg.d.type);
    projectile.doFrame(currentServerTime() - msg.d.starttime);
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

Game.prototype.walls = function() {
  return this._walls;
};

Game.prototype.player = function(id) {
  if(id == null) {
    if(this._playerID != null) {
      return this._players[this._playerID];
    } else {
      function noop(){}
      return {doPlayerFrame: noop, sendMessage: noop, accelerate: noop};
    }
  }
  return this._players[id] || (this._players[id] = new Player(this));
};

Game.prototype.removePlayer = function(id) {
  delete this._players[id];
};

Game.prototype.removeProjectile = function(id) {
  delete this._projectiles[id];
}

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

Game.prototype.image = function(type) {
  return this._images[type];
}