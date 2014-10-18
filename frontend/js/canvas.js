var canvas = document.getElementById('main-canvas');
var WIDTH = +canvas.getAttribute("width");
var HEIGHT = +canvas.getAttribute("height");

var ctx = canvas.getContext('2d');

var lastTick = 0;

function gameTick() {
  SocketConnection.send('p', [Player.x, Player.y]);
}

function doFrame(time){
  console.log(time - lastTick);
  while(time - lastTick > 0.1) {
    console.log(time);
    gameTick();
    lastTick = Math.min(time, lastTick + 0.1);
  }

  processCurrentKeyStates();

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "rgb(200,0,0)";
  ctx.fillRect (Player.x, Player.y, 20, 20);

  ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
  ctx.fillRect (30, 30, 55, 50);

  requestAnimationFrame(doFrame);
}

function drawGame() {

}