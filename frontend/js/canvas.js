var canvas = document.getElementById('main-canvas');
var WIDTH = +canvas.getAttribute("width");
var HEIGHT = +canvas.getAttribute("height");


var ctx = canvas.getContext('2d');

var lastTick = 0;

function startRenderCycle(game, time) {
  try {

    var dt = time - lastTick;
    currentlyDownKeys().forEach(function(key) {
      game.emit(key, 'down');
    });

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(200,0,0)";

    var now = currentServerTime();
    ctx.fillRect(now%WIDTH,0,5, 20);

    game.player().doPlayerFrame(dt);
    game.players().forEach(function(player) {
      ctx.fillStyle = player.color;
      player.doFrame(dt);
      var renderX, renderY;
      if(player.renderX == null && player.renderY == null) {
        renderX = player.x;
        renderY = player.y;
      } else {
        renderX = (player.x + player.renderX) / 2;
        renderY = (player.y + player.renderY) / 2;
      }
      if(player.meleeFrame) {
        ctx.fillRect(renderX + 12 + player.meleeDirX * 5 * player.meleeFrame,
                     renderY + 12 + player.meleeDirY * 5 * player.meleeFrame, 24, 24);
      }
      var img = game.image(player.type);
      if(img) {
        ctx.drawImage(img, renderX, renderY, 48, 48);
        ctx.fillStyle = 'green';
        ctx.arc(renderX + player.width / 2, renderY + player.height / 2, 24, 0, 2*Math.PI*player.health/player.maxHealth);
      } else {
        ctx.fillRect(renderX, renderY, 48, 48);
      }
      if(player.hurtFrame) {
        ctx.fillStyle = 'red'
        ctx.fillRect(renderX + 12, renderY + 12, 24, 24)
      }
      player.renderX = renderX;
      player.renderY = renderY;
    });

    game.projectiles().forEach(function(proj) {
      ctx.fillStyle = 'black';
      proj.doFrame(dt);

      var renderX, renderY;
      if(proj.renderX == null && proj.renderY == null) {
        renderX = proj.x;
        renderY = proj.y;
      } else {
        renderX = (proj.x + proj.renderX) / 2;
        renderY = (proj.y + proj.renderY) / 2;
      }

      ctx.fillRect(renderX, renderY, 20, 20);
    });

    ctx.fillStyle = 'black'
    game.walls().forEach(function(wall){
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    });
  } catch(e) {
    console.error(e);
  } finally {
    requestAnimationFrame(startRenderCycle.bind(null, game));
    lastTick = time; 
  }
}