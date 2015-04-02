(function(root) {
'use strict';

var Zhart = root.Zhart
    , helpers = Zhart.helpers;

var features = [backGround, text];
var layers = [xAxis, yAxis, line, area];

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

}(this));

/*
    TODO: Move this section out to different files
*/

function backGround (zhart, datasets, options) {
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

// A layer that draws the xAxis
function xAxis(zhart){
    var xAxis = d3.svg.axis()
        .scale(zhart.xScale)
        .orient('bottom')
        .ticks(3)
        .tickSize(1);
    var xAxisSvg = zhart.vis.selectAll('g.x-axis')
        .data([1])
        .enter()
        .append('g')
            .attr('class', 'x-axis')
            .attr("transform", "translate(0," + zhart.height + ")")
            .call(xAxis);
}

// A layer that draws the yAxis
function yAxis(zhart){
    var yAxis = d3.svg.axis()
        .scale(zhart.yScale)
        .orient('left')
        .ticks(3)
        .tickSize(1);
    var yAxisSvg = zhart.vis.selectAll('g.y-axis')
        .data([1])
        .enter()
        .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);
}

// A layer that draws lines for linegraph
function line(zhart, datasets){

    // Accepts data and returns a line path
    var lineFunc = d3.svg.line()
        .x(function(d){return zhart.xScale(d[0]);})
        .y(function(d){return zhart.yScale(d[1]);});

    // Accepts data and generates a class name
    var classFunc = function(d, index){
        return 'line '+index;
    }

    // Draws paths using datasets
    zhart.vis.selectAll('path.line')
        .data(datasets)
        .enter()
        .append('svg:path')
            .attr('d', lineFunc)
            .attr('class', classFunc)
            // TODO: Improve classFunc and put these things in scss
            .style('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
}

// A function that draws an area for linegraph
function area(zhart, datasets){

    // Accepts data and returns a line path
    var areaFunc = d3.svg.area()
        .x(function(d){return zhart.xScale(d[0]);})
        .y0(function(){return zhart.yScale(0);})
        .y1(function(d){return zhart.yScale(d[1]);});

    // Accepts data and generates a class name
    var classFunc = function(d, index){
        return 'area '+index;
    }

    // Draws paths using datasets
    zhart.vis.selectAll('path.area')
        .data(datasets)
        .enter()
        .append('svg:path')
            .attr('d', areaFunc)
            .attr('class', classFunc)
            // TODO: Improve classFunc and put these things in scss
            .style('fill', 'red')
            .style('opacity', 0.5)
            .attr('stroke', 'none')
            .attr('stroke-width', 1);
}
