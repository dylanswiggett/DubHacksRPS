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
      ctx.fillRect(player.x, player.y, 20, 20);
    });
    

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect (30, 30, 55 + Math.random() * 100, 50);
  } catch(e) {
    console.error(e);
  } finally {
    requestAnimationFrame(startRenderCycle.bind(null, game)); 
  }
}