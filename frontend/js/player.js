var Player = (function() {
  function Player(x, y) {
    this.vx = 'NOT YET IMPLEMENTED';
    this.vy = 'NOT YET IMPLEMENTED';
    this.x = x;
    this.y = y;
    this.type = 'dead';
  }

  Player.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.doSend = true;
  }

  Player.prototype.setPosition = function(x, y) {
    if(x) this.x = x;
    if(y) this.y = y;
  };

  Player.prototype.sendMessage = function() {
    if(this.doSend) {
      SocketConnection.send('p', [this.x, this.y]);
      this.doSend = false;
    }
  };

  Player.prototype.setType = function(type) {
    if(type) this.type = type;
  };

  Player.prototype.setHealth = function(health) {
    if(health) this.health = health;
  }

  return Player;
})();