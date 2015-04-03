(function(root) {
'use strict';

var Zhart = root.Zhart
var helpers = Zhart.helpers;

var features = [background, text];

var layers = Zhart.layers('xAxis', 'yAxis', 'line', 'area');

Zhart.prototype.Microchart = function (datasets, options) {
    if (!options) {options = {}};
    for (var i = 0; i<features.length; i++) {
        features[i](this, datasets, options);
    };

    // Each microchart has its own layers
    this.layers = layers.slice();

    this.redraw = function(){
        // TODO: Add autoScaling
        this.xScale.domain([0,10]);
        this.yScale.domain([0,10]);
        for(var i = 0; i < layers.length; i++){
            this.layers[i](this, datasets, options);
        }
    }

    // TODO: remove performance test
    var t = Date.now()
    for(var i = 0; i < 1000; i++){
        this.redraw();        
    }
    console.log('1000 redraws took: ', Date.now() - t, 'ms');
}


/*
    TODO: Move this section out to different files
*/

function background (zhart, datasets, options) {
    var bgColor = options.bgColor || 'black';
    zhart.svg
        .style('background-color', bgColor);
}

function text (zhart, datasets, options) {
    var text = options.text || 'what';
    zhart.svg.append('text')
        .attr('x', zhart.width/2)
        .attr('y', zhart.height/2)
        .text(text);
}

}(this));