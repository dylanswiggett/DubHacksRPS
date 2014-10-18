!function() {

  var game = new Game();

  //requestAnimationFrame(startRenderCycle.bind(null, game));

  function processCurrentKeyStates() {
    if(KeyStates.moveL) {
      Player.move(-1, 0);
    }
    if(KeyStates.moveR) {
      Player.move(1, 0);
    }
    if(KeyStates.moveD) {
      Player.move(0, 1);
    }
    if(KeyStates.moveU) {
      Player.move(0, -1);
    }
  }

/*  connection.on('playerconnect', function(data) {
    Players[data.id] = new Player(data[0], data[1]);
  });

  connection.on('p', function(msg) {
    getPlayer(msg.id).setPosition(msg.data[0], msg.data[1])
  });*/
/*    try {
      if(time - lastTick > 0.1) {
        gameTick();
        lastTick = time;
      }
      processCurrentKeyStates();
      drawGame();
    } catch(e) {
      console.error(e)
    } finally {
      requestAnimationFrame(doFrame);
    }*/
}();