(function(root) {
'use strict';

var Zhart = root.Zhart
    , helpers = Zhart.helpers;

var features = [Microchart, test];

Zhart.prototype.Microchart = function (datasets, options) {
    if (!options) {options = {}};
    for (var i = 0; i<features.length; i++) {
        features[i](this, datasets, options);
    };
}

function Microchart (zhart, datasets, options) {
    var bgColor = options.bgColor || 'black';
    zhart.svg.style('background-color', bgColor);
}

function test (zhart, datasets, options) {
    var text = options.text || 'what';
    zhart.svg.append('text')
        .attr('x', zhart.width/2)
        .attr('y', zhart.height/2)
        .text(text);
}

}(this));