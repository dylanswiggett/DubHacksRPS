
KeyStates = {};

var bindings = {
  'Left': 'moveL',
  'Right': 'moveR',
  'Up': 'moveU',
  'Down': 'moveD',
  'w': 'fireU',
  's': 'fireD',
  'a': 'fireL',
  'd': 'fireR',
  ' ': 'special'
};

var key_press = {
  w: true, s: true, a: true, d: true, ' ': true
};

var key_press_stream;
function keysSetGame(ee) {
  key_press_stream = ee;
}

document.onkeydown = function(e) {
  var binding = bindings[e.key];
  if(binding && !key_press[e.key]) {
    KeyStates[binding] = true;
  } else if(binding && key_press[e.key] && KeyStates[binding] != 'pressed') {
    key_press_stream.emit(binding);
    KeyStates[binding] = 'pressed';
  }
};

document.onkeyup = function(e) {
  var binding = bindings[e.key];
  if(binding) {
    KeyStates[binding] = false;
  }
};

function currentlyDownKeys() {
  var down = [];
  for(var k in KeyStates) {
    if(KeyStates[k] === true) {
      down.push(k);
    }
  }
  return down;
}