// start slingin' some d3 here.

// ============
// GAME SETTINGS
// ============
var gameOptions = {};

gameOptions.height = 768;
gameOptions.width = 1024;
gameOptions.numEnemies = 300;
gameOptions.enemyRadius = 10;

var playerOptions = {};
playerOptions.color = 'red';
playerOptions.startX = gameOptions.width/2;
playerOptions.startY = gameOptions.height/2;
playerOptions.radius = 10;


// ====================
// SET UP PLAYING FIELD
// ====================
d3.select('body').append('svg')
.attr('class', 'playingField')
.attr('height', gameOptions.height)
.attr('width', gameOptions.width);

var playingField  = d3.select('svg');

// ==============
// SET UP ENEMIES
// ==============
var enemies = new Array(gameOptions.numEnemies);

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
.attr('class', 'enemy')
.attr('cx', function(d) {return d[0];})
.attr('cy', function(d) {return d[1];})
.attr('r', gameOptions.enemyRadius);

// Have enemies move every second
setInterval(function() {
  setRandomEnemyPosition();
  playingField.selectAll('.enemy')
  .data(enemies)
  .transition()
  .duration(500)
  .attr('cx', function(d) {return d[0];})
  .attr('cy', function(d) {return d[1];})
  .attr('r', gameOptions.enemyRadius);
},1000);

// =============
// SET UP PLAYER
// =============

// Set up dragging behavior for player
var drag = d3.behavior.drag()
.on('drag', function(d) {
  // get new x and y position
  d[0] += d3.event.dx;
  d[1] += d3.event.dy;

  // bounds checking
  d[0] = Math.max(playerOptions.radius, d[0]);
  d[0] = Math.min(gameOptions.width - playerOptions.radius, d[0]);
  d[1] = Math.max(playerOptions.radius, d[1]);
  d[1] = Math.min(gameOptions.height - playerOptions.radius, d[1]);

  // set new position
  d3.select(this)
  .attr('cx', d[0])
  .attr('cy', d[1]);
});

// Insert player into playing field
playingField.selectAll('.player')
.data([[playerOptions.startX, playerOptions.startY]])
.enter()
.append('circle')
.attr('class', 'player')
.attr('cx', function(d) {return d[0];})
.attr('cy', function(d) {return d[1];})
.attr('r', playerOptions.radius)
.style('fill', playerOptions.color)
.call(drag);




















