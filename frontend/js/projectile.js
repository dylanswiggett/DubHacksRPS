
function Projectile() {
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

Projectile.prototype.doFrame = function(dt) {
  this.x += this.vx * dt / 1000;
  this.y += this.vy * dt / 1000;
};

Projectile.prototype.setPosition = function(x, y) {
  if(x != null) this.x = x;
  if(y != null) this.y = y;
};

Projectile.prototype.setVelocity = function(x, y) {
  if(x != null) this.vx = x;
  if(y != null) this.vy = y;
};