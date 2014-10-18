var MAX_SPEED = 600;
var FRICTION = 0.95;

var Player = (function() {
  function Player(game) {
    this.vx = 0;
    this.vy = 0;
    this.width = 48;
    this.height = 48;
    this.health = 0;
    this.type = 'dead';
    this._game = game;

    this.didOverlapX = [];
    this.didOverlapY = [];

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
    if(this.hurtFrame) this.hurtFrame--;
  };

  Player.prototype.doPlayerFrame = function(dt) {
    this.vx *= FRICTION;
    this.vy *= FRICTION;

    var walls = this.game().walls();

    for(var i = 0; i < walls.length; i++) {
      var wall = walls[i];
      //COLLIDE THINGS
      var newX = this.x + this.vx * dt / 1000;
      var newY = this.y + this.vy * dt / 1000;

      var overlapX = (newX < wall.x + wall.w)  &&
         (newX + this.width > wall.x);
      var overlapY = (newY < wall.y + wall.h) &&
         (newY + this.height > wall.y);

      if(overlapX && overlapY) {
        if(!this.didOverlapX[i]) {
          this.vx = 0;
          overlapX = false;
        }
        if(!this.didOverlapY[i]) {
          this.vy = 0;
          overlapY = false;
        }
      }
      this.didOverlapX[i] = overlapX;
      this.didOverlapY[i] = overlapY;
    }
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
    if(type != null && type != this.type) {
      this.type = type;
      this.getMaxHealth(true);
      this.getMeleeType(true);
    }
  };

  Player.prototype.getMaxHealth = function(refresh) {
    if(!refresh && this.maxHealth) return this.maxHealth;
    var metaInfo  = getPlayerMetaInfo()[this.type]
    this.maxHealth = metaInfo && +metaInfo.Health
    return this.maxHealth;
  };

  Player.prototype.getMeleeType = function(refresh) {
    if(!refresh && this.meleeImage) return this.maxHealth;
    var metaInfo = getPlayerMetaInfo()[this.type];
    this.meleeType = metaInfo && metaInfo.MeleeType;
    return this.meleeType;
  };

  Player.prototype.setHealth = function(health) {
    if(health != null) this.health = health;
  }

  Player.prototype.startMelee = function(dir) {
    this.meleeFrame = 10;
    this.meleeDirX = (dir == 'u' || dir == 'd') ? 0 : (dir == 'l' ? -1 : 1);
    this.meleeDirY = (dir == 'l' || dir == 'r') ? 0 : (dir == 'u' ? -1 : 1)
  };

  Player.prototype.hurt = function() {
    this.hurtFrame = 10;
  }

  Player.prototype.game = function(g) {
    if(g) return this._game = g;
    else return this._game;
  };

  return Player;
})();