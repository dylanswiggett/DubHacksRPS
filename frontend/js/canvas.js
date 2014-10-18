var canvas = document.getElementById('main-canvas');
var WIDTH = +canvas.getAttribute("width");
var HEIGHT = +canvas.getAttribute("height");

var ctx = canvas.getContext('2d');

var lastTick = 0;

function startRenderCycle(game, time) {
  try {
    currentlyDownKeys().forEach(function(key) {
      game.emit(key, 'down');
    });

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(200,0,0)";

    game.player().doPlayerFrame();
    game.players().forEach(function(player) {
      ctx.fillStyle = player.color;
      player.doFrame();
      var renderX, renderY;
      if(player.renderX == null && player.renderY == null) {
        renderX = player.x;
        renderY = player.y;
      } else {
        renderX = (player.x + player.renderX) / 2;
        renderY = (player.y + player.renderY) / 2;
      }
      ctx.fillRect(renderX, renderY, 48, 48);
      player.renderX = renderX;
      player.renderY = renderY;
    });
  } catch(e) {
    console.error(e);
  } finally {
    requestAnimationFrame(startRenderCycle.bind(null, game)); 
  }
}