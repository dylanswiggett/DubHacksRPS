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

    game.players().forEach(function(player) {
      player.doFrame();
      var renderX, renderY;
      if(player.renderedX == null && player.renderedY == null) {
        renderX = player.x;
        renderY = player.y;
      } else {
        renderX = (player.x + renderX) / 2;
        renderY = (player.y + renderY) / 2;
      }
      ctx.fillRect(renderX, renderY, 48, 48);
      player.renderX = renderX;
      player.renderY = renderY;
    });
    

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect (30, 30, 55 + Math.random() * 100, 50);
  } catch(e) {
    console.error(e);
  } finally {
    requestAnimationFrame(startRenderCycle.bind(null, game)); 
  }
}