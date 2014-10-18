var MAX_SPEED = 5;
var FRICTION = 0.9;

var Player = (function() {
  function Player(x, y) {
    this.vx = 0;
    this.vy = 0;
    this.x = x;
    this.y = y;
    this.type = 'dead';
  }

  Player.prototype.doFrame = function() {
    this.x += this.vx;
    this.y += this.vy;
  };

  Player.prototype.doPlayerFrame = function() {
    this.vx *= FRICTION;
    this.vy *= FRICTION;
  };

  Player.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  Player.prototype.accelerate = function(x, y) {
    this.vx = Math.max(Math.min(MAX_SPEED, this.vx + x), -MAX_SPEED);
    this.vy = Math.max(Math.min(MAX_SPEED, this.vy + y), -MAX_SPEED);
    this.doSend = true;
  }

  Player.prototype.setPosition = function(x, y) {
    if(x != null) this.x = x;
    if(y != null) this.y = y;
  };

  Player.prototype.setVelocity = function(x, y) {
    if(x != null) this.vx = x;
    if(y != null) this.vy = y;
  };

  Player.prototype.sendMessage = function(connection) {
    if(this.doSend) {
      connection.send('p', {x: this.x, y: this.y, vx:this.vx, vy: this.vy});
      this.doSend = false;
    }
  };

  Player.prototype.setType = function(type) {
    if(type != null) this.type = type;
  };

  Player.prototype.setHealth = function(health) {
    if(health != null) this.health = health;
  }

  return Player;
})();