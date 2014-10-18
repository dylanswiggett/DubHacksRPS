
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
};

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

function currentlyDownKeys() {
  var down = [];
  for(var k in KeyStates) {
    if(KeyStates[k] === true) {
      down.push(k);
    }
  }
  return down;
}