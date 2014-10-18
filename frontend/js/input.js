
KeyStates = {};

var bindings = {
  'Left': 'moveL',
  'Right': 'moveR',
  'Up': 'moveU',
  'Down': 'moveD',
  'w': 'fireU',
  's': 'fireD',
  'a': 'fireL',
  'd': 'fireR'
}

document.onkeydown = function(e) {
  var binding = bindings[e.key];
  if(binding) {
    KeyStates[binding] = true;
  }
};

document.onkeyup = function(e) {
  var binding = bindings[e.key];
  if(binding) {
    KeyStates[binding] = false;
  }
};


Player = {x: 0, y: 0};
function processCurrentKeyStates() {
  if(KeyStates.moveL) {
    Player.x -= 1
  }
  if(KeyStates.moveR) {
    Player.x += 1
  }
  if(KeyStates.moveD) {
    Player.y += 1
  }
  if(KeyStates.moveU) {
    Player.y -= 1
  }
}