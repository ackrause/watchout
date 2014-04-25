// start slingin' some d3 here.

var gameOptions = {};

gameOptions.height = 768;
gameOptions.width = 1024;

d3.select('body').append('svg')
.attr('height', gameOptions.height)
.attr('width', gameOptions.width);
