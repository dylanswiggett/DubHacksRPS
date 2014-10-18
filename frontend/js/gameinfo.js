
function playableTypes(pmi) {
  var types = [];
  for(var k in pmi) {
    if(pmi[k].Object == 'Player') {
      console.log("Can play as", k);
      types.push(k);
    }
  }
  return types;
}

var _playerTypes
function setPlayerTypes(pt) {
  _playerTypes = pt;
}

function getPlayerTypes() {
  return _playerTypes;
}

var _pmi;
function setPlayerMetaInfo(pmi) {
  _pmi = pmi;
}

function getPlayerMetaInfo() {
  return _pmi;
}