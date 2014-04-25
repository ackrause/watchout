// start slingin' some d3 here.

var gameOptions = {};

gameOptions.height = 768;
gameOptions.width = 1024;
gameOptions.enemies = 300;

d3.select('body').append('svg')
.attr('class', 'playingField')
.attr('height', gameOptions.height)
.attr('width', gameOptions.width);

var playingField  = d3.select('svg');

var enemies = new Array(gameOptions.enemies);

// Initialize enemies positions
var setRandomEnemyPosition = function() {
  for (var i = 0; i < enemies.length; i++) {
    var x = Math.floor(Math.random() * gameOptions.width);
    var y = Math.floor(Math.random() * gameOptions.height);
    enemies[i] = [x, y];
  }
};
setRandomEnemyPosition();

// Insert enemies into playing field
playingField.selectAll('circle')
.data(enemies)
.enter()
.append('circle')
.attr('cx', function(d) {return d[0];})
.attr('cy', function(d) {return d[1];})
.attr('r', 10);

// Have enemies move every second
setInterval(function() {
  setRandomEnemyPosition();
  playingField.selectAll('circle')
  .data(enemies)
  .transition()
  .duration(500)
  .attr('cx', function(d) {return d[0];})
  .attr('cy', function(d) {return d[1];})
  .attr('r', 10);
},1000);
