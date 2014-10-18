var MAX_SPEED = 600;
var FRICTION = 0.95;

var Player = (function() {
  function Player(x, y) {
    this.vx = 0;
    this.vy = 0;
    this.x = x;
    this.y = y;
    this.type = 'rock';

    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    this.color = color;
  }

  Player.prototype.doFrame = function(dt) {
    this.x += this.vx * dt / 1000;
    this.y += this.vy * dt / 1000;
    this.vx *= FRICTION;
    this.vy *= FRICTION;

    if(this.meleeFrame) this.meleeFrame--;
  };

  Player.prototype.doPlayerFrame = function(dt) {
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
      connection.send('p', {x: this.x, y: this.y, vx:this.vx, vy: this.vy, type:this.type});
      this.doSend = false;
  };

  Player.prototype.setType = function(type) {
    if(type != null) this.type = type;
  };

  Player.prototype.setHealth = function(health) {
    if(health != null) this.health = health;
  }

  Player.prototype.startMelee = function(dir) {
    this.meleeFrame = 10;
    this.meleeDirX = (dir == 'u' || dir == 'd') ? 0 : (dir == 'l' ? -1 : 1);
    this.meleeDirY = (dir == 'l' || dir == 'r') ? 0 : (dir == 'u' ? -1 : 1)
  };

  return Player;
})();