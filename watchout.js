// start slingin' some d3 here.

// ============
// GAME SETTINGS
// ============
var gameOptions = {};

gameOptions.height = 768;
gameOptions.width = 1024;
gameOptions.numEnemies = 30;
gameOptions.enemyRadius = 30;

var playerOptions = {};

playerOptions.color = 'red';
playerOptions.startX = gameOptions.width/2;
playerOptions.startY = gameOptions.height/2;
playerOptions.radius = 10;

// Updates current score
var updateScore = function() {
  var score = +d3.select('.current span').text();
  var highScore = +d3.select('.high span').text();
  score++;
  d3.select('.current span').text(score);
  if (highScore < score) {
    d3.select('.high span').text(score);
  }
};
setInterval(updateScore, 500);

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
var enemiesPos = new Array(gameOptions.numEnemies);

// Initialize enemies positions
var setRandomEnemyPosition = function() {
  for (var i = 0; i < enemiesPos.length; i++) {
    var x = Math.floor(Math.random() * gameOptions.width);
    var y = Math.floor(Math.random() * gameOptions.height);
    enemiesPos[i] = [x, y];
  }
};
setRandomEnemyPosition();

// Insert enemies into playing field
playingField.selectAll('.enemy')
.data(enemiesPos)
.enter()
.append('image')
.attr('xlink:href', 'shuriken.png')
.attr('class', 'enemy')
.attr('x', function(d) {return d[0];})
.attr('y', function(d) {return d[1];})
.attr('height', 2*gameOptions.enemyRadius)
.attr('width', 2*gameOptions.enemyRadius);


// Collision detection between given enemy and player
var collisionDetector = function(enemy, callback) {
  var player = d3.select('.player');
  var enemyX = +enemy.attr('x')+gameOptions.enemyRadius;
  var enemyY = +enemy.attr('y')+gameOptions.enemyRadius;
  var playerX = +player.attr('cx');
  var playerY = +player.attr('cy');
  var enemyRadius = gameOptions.enemyRadius;
  var playerRadius = playerOptions.radius;

  var distance = Math.sqrt(Math.pow(enemyX - playerX, 2) + Math.pow(enemyY - playerY, 2));
  if ( distance < enemyRadius + playerRadius) {
    callback();
  }
};

// After colliding with enemy, reset score
// If score was higher than high score, update it
var resetBoard = function() {
  var collisions = +d3.select('.collisions span').text();
  d3.select('.current span').text(0);
  collisions++;
  d3.select('.collisions span').text(collisions);
};

// Custom tween function for enemies
// Allows access to position during transition
// for collision detetction
var enemyTween = function(d) {
  var enemy = d3.select(this);
  var startX = +enemy.attr('x');
  var startY = +enemy.attr('y');
  var endX = d[0];
  var endY = d[1];
  return function(t) {
    var newX = startX + (endX - startX)*t;
    var newY = startY + (endY - startY)*t;

    //collision detection function goes here
    collisionDetector(enemy, resetBoard);

    enemy.attr('x', newX)
    .attr('y', newY);
  };
};

// Have enemies move every second
setInterval(function() {
  setRandomEnemyPosition();
  playingField.selectAll('.enemy')
  .data(enemiesPos)
  .transition()
  .duration(500)
  .tween('custom', enemyTween);
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
