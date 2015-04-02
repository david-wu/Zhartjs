(function(root) {
'use strict';

var Zhart = root.Zhart
    , helpers = Zhart.helpers;

var features = [backGround, text];
var layers = [xAxis, yAxis, line];

Zhart.prototype.Microchart = function (datasets, options) {
    if (!options) {options = {}};
    for (var i = 0; i<features.length; i++) {
        features[i](this, datasets, options);
    };

    this.redraw = function(){
        // TODO: Add autoScaling
        this.xScale.domain([0,10])
        this.yScale.domain([0,10])
        for(var i = 0; i < layers.length; i++){
            layers[i](this, datasets, options)
        }
    }

    // TODO: remove performance test
    var t = Date.now()
    for(var i = 0; i < 1000; i++){
        this.redraw();        
    }
    console.log('1000 redraws took: ', Date.now() - t, 'ms');

}

}(this));

/*
    TODO: Move this section out to different files
*/

function backGround (zhart, datasets, options) {
    var bgColor = options.bgColor || 'black';
    zhart.svg.style('background-color', bgColor);
}

function text (zhart, datasets, options) {
    var text = options.text || 'what';
    zhart.svg.append('text')
        .attr('x', zhart.width/2)
        .attr('y', zhart.height/2)
        .text(text);
}


// A layer that contains the xAxis
function xAxis(zhart){
    var xAxis = d3.svg.axis()
        .scale(zhart.xScale)
        .orient('bottom')
        .ticks(3)
        .tickSize(1)
    var xAxisSvg = zhart.vis.selectAll('g.x-axis')
        .data([1])
        .enter()
        .append('g')
            .attr('class', 'x-axis')
            .attr("transform", "translate(0," + zhart.height + ")")
            .call(xAxis);
}


// A layer that contains the yAxis
function yAxis(zhart){
    var yAxis = d3.svg.axis()
        .scale(zhart.yScale)
        .orient('left')
        .ticks(3)
        .tickSize(1)
    var yAxisSvg = zhart.vis.selectAll('g.y-axis')
        .data([1])
        .enter()
        .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);
}

// A layer that contains lines for linegraph
function line(zhart){

}
