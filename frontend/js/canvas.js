var canvas = document.getElementById('main-canvas');
var WIDTH = +canvas.getAttribute("width");
var HEIGHT = +canvas.getAttribute("height");


var ctx = canvas.getContext('2d');

var lastTick = 0;

function startRenderCycle(game, time) {
  try {

    var dt = time - lastTick;
    if(game.player().type !== 'dead') {
      currentlyDownKeys().forEach(function(key) {
        game.emit(key, 'down');
      });
    }

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(200,0,0)";

    function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
      context.save();
      context.translate( positionX + axisX/2, positionY + axisY/2);
      context.rotate( angleInRad );
      context.translate( axisX/2, axisY/2 );
      context.drawImage( image, -axisX, -axisY );
      context.restore();
    }

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
        var img = game.image(player.getMeleeType());
        if(img) {
          var angle;
          if(player.meleeDirX == -1) {
            angle = Math.PI;
          } else if(player.meleeDirX == 1) {
            angle = 0;
          } else if(player.meleeDirY == -1) {
            angle = 3*Math.PI/2;
          } else if(player.meleeDirY == 1) {
            angle = Math.PI/2;
          }
          rotateAndPaintImage(ctx, img, angle, renderX + player.meleeDirX * 6 * player.meleeFrame,
            renderY + player.meleeDirY * 6 * player.meleeFrame, 48, 48);
          /*ctx.drawImage(img, renderX + player.meleeDirX * 5 * player.meleeFrame,
                     renderY + player.meleeDirY * 5 * player.meleeFrame, 48, 48);*/
        } else {
          ctx.fillRect(renderX + player.meleeDirX * 5 * player.meleeFrame,
                     renderY + player.meleeDirY * 5 * player.meleeFrame, 48, 48);
        }

      }
      var img = game.image(player.type);
      if(img) {
        ctx.drawImage(img, renderX, renderY, 48, 48);
        if(player.health > 0) {
          ctx.strokeStyle = 'green';
          ctx.lineWidth = 5
          ctx.moveTo(renderX + player.width / 2, renderY + player.height / 2);
          ctx.beginPath();
          ctx.arc(renderX + player.width / 2, renderY + player.height / 2, 27, 0, 2*Math.PI*player.health/player.getMaxHealth())
          ctx.stroke();
          ctx.closePath();
        }
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
      var img = game.image(proj.type);
      ctx.fillStyle = 'black';
      proj.doFrame(dt);
      var angle;
      if(proj.vy < 0) {
        angle = 3*Math.PI/2;
      } else if(proj.vy > 0) {
        angle = Math.PI/2;
      } else if(proj.vx < 0) {
        angle = Math.PI;
      } else if(proj.vx > 0) {
        angle = 0;
      }

      var renderX, renderY;
      if(proj.renderX == null && proj.renderY == null) {
        renderX = proj.x;
        renderY = proj.y;
      } else {
        renderX = (proj.x + proj.renderX) / 2;
        renderY = (proj.y + proj.renderY) / 2;
      }

      if(img) {
        rotateAndPaintImage(ctx, img, angle, renderX, renderY, 20, 20); 
        //ctx.drawImage(img, renderX, renderY, 20, 20);
      } else {
        ctx.fillRect(renderX, renderY, 20, 20);
      }

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