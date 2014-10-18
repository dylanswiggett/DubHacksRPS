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
        ctx.fillRect(renderX + 12 + player.meleeDirX * player.meleeFrame,
                     renderY + 12 + player.meleeDirY * player.meleeFrame, 24, 24);
      }
      ctx.fillRect(renderX, renderY, 48, 48);
      player.renderX = renderX;
      player.renderY = renderY;
    });

    game.projectiles().forEach(function(proj) {
      ctx.fillStyle = 'black';
      proj.doFrame(dt);

      ctx.fillReact(proj.x, proj.y, 20, 20);
    });
  } catch(e) {
    console.error(e);
  } finally {
    requestAnimationFrame(startRenderCycle.bind(null, game));
    lastTick = time; 
  }
}