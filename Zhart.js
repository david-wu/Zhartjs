var _ = require('lodash')
    , d3 = require('d3')
    , Domain = require('./Zhart.Domain')
    , features = require('./Features.helpers')
    , layers = require('./Layers.helpers');

/**
 * Creates the Zhart base class, initalize the svg on which to draw all
 * other graphs.
 * @param {svg}
 * @param {options}
 */

function Zhart (zhart) {
    var that = this;

    // Sets default values
    _.defaults(this, {
        layers: [],
        features: [],
        width: 300,
        height: 200,
        margins: {
            top: 10,
            left: 30,
            bottom: 30,
            right:10
        },
        // Scales used to draw within vis
        yScale: d3.scale.linear(),
        xScale: d3.scale.linear(),
        // Determines which section of the chart to show
        xDomain: new Domain([0,10]),
        yDomain: new Domain([0,10])
    });

    // Allow users to overwrite defaults on init
    _.extend(this, zhart);
    
    // A context must be provided.. for now..
    if(!this.context){throw new TypeError('Context needed :( sorry');}
    this.svg = d3.select(this.context)
        .append('svg')
        .classed('zhart', true);
    this.vis = this.svg.append('g')
        .classed('vis', true);

    // Initializes features
    _.each(this.features, function(feature){
        feature.init(that);
    });

    // TODO: remove! (performance test)
    var tTime = 0;
    setInterval(function () {
        var t = Date.now();
        that.redraw();
        tTime += (Date.now() - t);
    }, 16);
    setInterval(function(){
        console.log((tTime/10)+'% time spent redrawing');
        tTime = 0;
    }, 1000);

    return this;
}

// Draws each layer
Zhart.prototype.redraw = function(){
    var that = this;

    this.resize();

    // TODO: Add autoScaling
    this.xScale.domain(this.xDomain);
    this.yScale.domain(this.yDomain);

    _.each(this.layers, function(layer){
        layer.draw(that);
    });
};

Zhart.features = features;

Zhart.layers = layers;

// Resizes svg and vis based on width, height, and margins
Zhart.prototype.resize = function(){

    this.svg
        .attr('width', this.width)
        .attr('height', this.height);

    // Contains most graphics, leaving margin room
    this.visWidth = this.width - this.margins.left - this.margins.right;
    this.visHeight = this.height - this.margins.top - this.margins.bottom;
    this.vis
        .attr('width', this.visWidth)
        .attr('height', this.visHeight)
        .attr('transform', 'translate(' + this.margins.left + ',' + this.margins.top + ')');

    // Redefine scales used for drawing
    this.yScale
        .range([this.visHeight, 0]);
    this.xScale
        .range([0, this.visWidth]);            
};

/*
    TODO: MOVE THIS STUFF OUT!
*/

function Domain(domain){
    if(!domain || !_.isArray(domain) || domain.length!==2 ){
        console.log(domain)
        throw new RangeError('Invalid Domain');
    }
    domain.startTime = startTime;
    domain.stopTime = stopTime;
    return domain;
}
function startTime(){
    var that = this;
    this.stopTime();
    var time = Date.now();
    this.realTimeInterval = setInterval(function(){
        var timePassed = Date.now()-time;
        that[0] += timePassed;
        that[1] += timePassed;
        time = Date.now();
    },16);
}
function stopTime(){
    clearInterval(this.realTimeInterval);
    this.realTimeInterval = null;
}


function DataSet(dataSet){
    dataSet.closestXIndex = closestXIndex;
    dataSet.selectIntersection = selectIntersection;
    return dataSet;
}

// Given an xDomain, find the slice of the dataset that is inside within the domain +- bufferRatio
function selectIntersection(xDomain, bufferRatio){
    // Buffer is how much more I want to select outide of the xDomain
    bufferRatio = bufferRatio || 0.3;
    var buffer = (xDomain[1] - xDomain[0])*bufferRatio;
    var lowerEnd = this.closestXIndex(xDomain[0]-buffer);
    var upperEnd = this.closestXIndex(xDomain[1]+buffer)+1;
    return this.slice(lowerEnd, upperEnd);
}

// Given a target x value, find the closest point's index, improve speed by using spacing
// Could replace with binary search
function closestXIndex(target, spacing){
    spacing = spacing || 1000;

    // Estimate index of closestXIndex using spacing
    var index = Math.round((target-this[0][0])/spacing);

    // If unable to estimate, check if first or last value is closer to target
    if(_.isUndefined(this[index])){
        if( (_.last(this)[0] - target) < (target - _.first(this)[0])){
            index = this.length-1;
        }else{
            index = 0;
        }
    }

    // Finds closestXIndex to within one
    while(!_.isUndefined(this[index-1]) && this[index][0] > target){
        index--;
    }
    while(!_.isUndefined(this[index+1]) && this[index][0] < target){
        index++;
    }

    // Now find out if this[index-1] or this[index] is closer to target
    if(_.isUndefined(this[index-1])){
        return index;
    }
    var diffLeft = target - this[index-1][0];
    var diffRight = this[index][0] - target;
    if(diffLeft < diffRight){
        return index-1;
    }else{
        return index;
    }
}

Zhart.prototype.microchart = function(){
  var that = this;

  var features = Zhart.features('background', 'text', 'dragXDomain');
  features[0]
    .set('color', 'orange')
    .set('color', 'yellow');
  features[1]
    .set('color', 'purple')
    .set('x', 200);

  var layers = Zhart.layers('xAxis', 'yAxis', 'area', 'line');
  layers[0]
    .set('ticks', '5')
    .set('orient', 'bottom');
  layers[2]
    .set('interpolate', 'basis');
  layers[3]
    .set('interpolate', 'basis');

  // Initializes new features
  _.each(features, function(feature){
    feature.init(that);
  });

  // TODO: extend current layers/features instead of overwriting
  this.layers = layers.slice();
  this.features = features.slice();
};

module.exports = Zhart;

(function(root) {
'use strict';

var Zhart = root.Zhart;

Zhart.helpers = {

};

}(this));
var _ = require('lodash');

/*
	features lets you retrieve the corresponding features functions
	feature functions are run when the chart is initialized

	Zhart.features('xAxis', 'yAxis', 'line')
		=> [func, func, func]

	Zhart.features['xAxis']
		=> func
*/

var features = function(){
	return _.map(arguments, function(str){
		return features[str]();
	});
};

features.background = (function(options){

	// Options contains accessible feature attributes
	options = _.isObject(options) || {};
	_.defaults(options,{
		color: 'grey'
	});

	// Initializes this feature
	var svg;
	function init(zhart){
		destroy();
	    svg = zhart.svg
	        .style('background-color', options.color);
    }

	// Cleans up this feature
	function destroy(){
		if(!_.isUndefined(svg) && _.isFunction(svg.style))
		svg
	        .style('background-color', 'none');
	}

	return {
		options: options,
		set: setOptions,
		init: init,
		destroy: destroy
	};

});

features.text = (function(options){

	// Options contains accessible feature attributes
	options = _.isObject(options) || {};
	_.defaults(options,{
		class: null,
		text: 'default text',
		x: 50,
		y: 50,
		color: 'black'
	});

	// Initializes this feature
	var textEl;
	function init(zhart){
		destroy();
	    textEl = zhart.svg.append('text')
	    	.attr('class', options.class)
	        .text(options.text)
	        .attr('x', options.x)
	        .attr('y', options.y)
	        .attr('fill', options.color);
	}

	// Cleans up this feature
	function destroy(){
		if(textEl && _.isFunction(textEl.remove)){
			textEl.remove();
		}
	}

	return {
		options: options,
		set: setOptions,
		init: init,
		destroy: destroy
	};
});

features.dragXDomain = (function(options){

	// Options contains accessible feature attributes
	options = _.isObject(options) || {};
	_.defaults(options,{
	});

	// Initializes this feature
	function init(zhart){

		// Limit to one dragBehave per zhart.svg
		var dragBehave = zhart.svg.dragBehave || d3.behavior.drag();
		zhart.svg.dragBehave = dragBehave;
		destroy();

		// d3 events need to be namespaced
		dragBehave
			.on('dragstart.xDomain', dragStart)
			.on('drag.xDomain', drag)
			.on('dragend.xDomain', dragEnd);
		function dragStart(d) {
			d3.event.sourceEvent.stopPropagation();
			d3.select(this)
				.classed('dragging', true);
		}
		function drag(d) {
			var xShift = zhart.xScale.invert(0) - zhart.xScale.invert(d3.event.dx);
			zhart.xDomain[0] += xShift;
			zhart.xDomain[1] += xShift;
		}
		function dragEnd(d) {
			d3.select(this)
				.classed('dragging', false);
		}
		zhart.svg.call(dragBehave);

	}

	// Cleans up this feature
	function destroy () {
		// TODO
	}

	return {
		options: options,
		set: setOptions,
		init: init,
		destroy: destroy
	};

});

features.dragYDomain = (function(options){

	// Options contains accessible feature attributes
	options = _.isObject(options) || {};
	_.defaults(options,{
	});

	// Initializes this feature
	function init(zhart){

		// Limit to one dragBehave per zhart.svg
		var dragBehave = zhart.svg.dragBehave || d3.behavior.drag();
		zhart.svg.dragBehave = dragBehave;

		// d3 events need to be namespaced
		dragBehave
			.on('dragstart.yDomain', dragStart)
			.on('drag.yDomain', drag)
			.on('dragend.yDomain', dragEnd);
		function dragStart(d) {
			d3.event.sourceEvent.stopPropagation();
			d3.select(this)
				.classed('dragging', true);
		}
		function drag(d) {
			var yShift = zhart.yScale.invert(0) - zhart.yScale.invert(d3.event.dy);
			zhart.yDomain[0] += yShift;
			zhart.yDomain[1] += yShift;
		}
		function dragEnd(d) {
			d3.select(this)
				.classed('dragging', false);
		}
		zhart.svg.call(dragBehave);
	}

	// Cleans up this feature
	function destroy(){
		// TODO
	}

	return {
		options: options,
		set: setOptions,
		init: init,
		destroy: destroy
	};
});

// Used to safely change option's values
function setOptions(key, val){
	if(_.isUndefined(this.options[key])){
		throw new RangeError('set('+key+', '+val+'): Invalid key');
	}
	if((key === 'init') || (key === 'destroy')){
		throw new RangeError('can not set init or destroy');
	}
	this.options[key] = val;
	return this;
}

module.exports = features;

var _ = require('lodash');

/*
	layers lets you retrieve the corresponding layer functions
	layer functions draw stuff on the chart everytime the chart is redrawn

	Zhart.layers('xAxis', 'yAxis', 'line')
		=> [func, func, func]

	Zhart.layers['xAxis']
		=> func
*/

var layers = function(){
    return _.map(arguments, function(str){
       return layers[str];
    });
};

// A layer that draws the xAxis
layers.xAxis = (function(options){

    // Options contains accessible feature attributes
    options = _.isObject(options) || {};
    _.defaults(options,{
        ticks: 3,
        tickSize: 1,
        orient: 'bottom',
        tickFormat: function(d){
            return options.format(new Date(d));
        },
        format: d3.time.format('%X')
    });


    function draw(zhart){
        var xAxis = d3.svg.axis()
            .scale(zhart.xScale)
            .orient(options.orient)
            .ticks(options.ticks)
            .tickSize(options.tickSize)
            .tickFormat(options.tickFormat);
        var xAxisGroup = zhart.vis.selectAll('g.x-axis')
            .data([1]);
        xAxisGroup.enter()
            .append('g')
                .attr('class', 'x-axis');
        xAxisGroup
            .attr("transform", "translate(0," + zhart.visHeight + ")")
            .call(xAxis);
        xAxisGroup
            .exit()
                .remove();
    };

    return {
        options: options,
        set: setOptions,
        draw: draw
    };

})();

// A layer that draws the yAxis
layers.yAxis = (function(options){

    // Options contains accessible feature attributes
    options = _.isObject(options) || {};
    _.defaults(options,{
        ticks: 3,
        tickSize: 1,
        orient: 'left',
    });

    function draw (zhart){
        var yAxis = d3.svg.axis()
            .scale(zhart.yScale)
            .orient(options.orient)
            .ticks(options.ticks)
            .tickSize(options.tickSize);
        var yAxisGroup = zhart.vis.selectAll('g.y-axis')
            .data([1]);
        yAxisGroup.enter()
            .append('g')
                .attr('class', 'y-axis');
        yAxisGroup
            .call(yAxis);
        yAxisGroup
            .exit()
                .remove();
    };

    return {
        options: options,
        set: setOptions,
        draw: draw
    };
})();

// A layer that draws lines for linegraph
layers.line = (function(options){

    // Options contains accessible feature attributes
    options = _.isObject(options) || {};
    _.defaults(options,{
        interpolate: 'line',
        stroke: 'blue',
        strokeWidth: 0.8
    });

    function draw(zhart){

        // Trims off part of datasets that are outside of zhart.xDomain
        var dataSets = _.map(zhart.dataSets, function(dataSet){
            return dataSet.selectIntersection(zhart.xDomain);
        });

        // Accepts data and returns a line path
        var lineFunc = d3.svg.line()
            .x(function(d){return zhart.xScale(d[0]);})
            .y(function(d){return zhart.yScale(d[1]);})
            .interpolate(options.interpolate);

        // Accepts data and generates a class name
        var classFunc = function(d, index){
            return 'line '+index;
        };

        // Selects, enters, updates, then exits lines
        var lines = zhart.vis.selectAll('path.line')
            .data(dataSets);
        lines.enter()
            .append('svg:path')
                // TODO: Improve classFunc and put these things in scss
                .style('fill', 'none')
                .attr('stroke', options.stroke)
                .attr('stroke-width', options.strokeWidth);
        lines
            .attr('d', lineFunc)
            .attr('class', classFunc);
        lines
            .exit()
                .remove();

    };

    return {
        options: options,
        set: setOptions,
        draw: draw
    };

})();

// A function that draws an area for linegraph
layers.area = (function(options){

    // Options contains accessible feature attributes
    options = _.isObject(options) || {};
    _.defaults(options,{
        interpolate: 'line',
        fill: 'red',
    });

    function draw(zhart){

        // Trims off part of datasets that are outside of zhart.xDomain
        var dataSets = _.map(zhart.dataSets, function(dataSet){
            return dataSet.selectIntersection(zhart.xDomain);
        });

        // Accepts data and returns an area path
        var areaFunc = d3.svg.area()
            .x(function(d){return zhart.xScale(d[0]);})
            .y0(function(){return zhart.yScale(0);})
            .y1(function(d){return zhart.yScale(d[1]);})
            .interpolate(options.interpolate);

        // Accepts data and generates a class name
        var classFunc = function(d, index){
            return 'area '+index;
        };

        // Selects, enters, updates, then exits areas
        var areas = zhart.vis.selectAll('path.area')
            .data(dataSets);
        areas.enter()
            .append('svg:path')
                // TODO: Improve classFunc and put these things in scss
                .style('fill', options.fill)
                .style('opacity', 0.5)
                .attr('stroke', 'none')
                .attr('stroke-width', 0);
        areas
            .attr('d', areaFunc)
            .attr('class', classFunc);
        areas
            .exit()
                .remove();

    };

    return {
        options: options,
        set: setOptions,
        draw: draw
    };

})();

// Used to safely change option's values
function setOptions(key, val){
    if(_.isUndefined(this.options[key])){
        throw new RangeError('set('+key+', '+val+'): Invalid key');
    }
    if((key === 'init') || (key === 'destroy')){
        throw new RangeError('can not set init or destroy');
    }
    this.options[key] = val;
    return this;
}

module.exports = layers;
var _ = require('lodash');

function DataSet(dataSet){
  dataSet.closestXIndex = closestXIndex;
  dataSet.selectIntersection = selectIntersection;
  return dataSet;
}

// Given an xDomain, find the slice of the dataset that is inside within the domain +- bufferRatio
function selectIntersection(xDomain, bufferRatio){
  // Buffer is how much more I want to select outide of the xDomain
  bufferRatio = bufferRatio || 0.3;
  var buffer = (xDomain[1] - xDomain[0])*bufferRatio;
  var lowerEnd = this.closestXIndex(xDomain[0]-buffer);
  var upperEnd = this.closestXIndex(xDomain[1]+buffer)+1;
  return this.slice(lowerEnd, upperEnd);
}

// Given a target x value, find the closest point's index, improve speed by using spacing
// Could replace with binary search
function closestXIndex(target, spacing){
  spacing = spacing || 1;

  // Estimate index of closestXIndex using spacing
  var index = Math.round((target-this[0][0])/spacing);

  // If unable to estimate, check if first or last value is closer to target
  if(_.isUndefined(this[index])){
    if( (_.last(this)[0] - target) < (target - _.first(this)[0])){
      index = this.length-1;
    }else{
      index = 0;
    }
  }

  // Finds closestXIndex to within one
  while(!_.isUndefined(this[index-1]) && this[index][0] > target){
    index--;
  }
  while(!_.isUndefined(this[index+1]) && this[index][0] < target){
    index++;
  }

  // Now find out if this[index-1] or this[index] is closer to target
  if(_.isUndefined(this[index-1])){
    return index;
  }
  var diffLeft = target - this[index-1][0];
  var diffRight = this[index][0] - target;
  if(diffLeft < diffRight){
    return index-1;
  }else{
    return index;
  }
}

module.exports = DataSet;
var _ = require('lodash');

function Domain(domain){
  if(!domain || !_.isArray(domain) || domain.length!==2 ){
    console.log(domain);
    throw new RangeError('Invalid Domain');
  }
  domain.startTime = startTime;
  domain.stopTime = stopTime;
  return domain;
}
function startTime(){
  var that = this;
  this.stopTime();
  var time = Date.now();
  this.realTimeInterval = setInterval(function(){
    var timePassed = Date.now()-time;
    that[0] += timePassed;
    that[1] += timePassed;
    time = Date.now();
  },16);
}
function stopTime(){
  clearInterval(this.realTimeInterval);
  this.realTimeInterval = null;
}

module.exports = Domain;
var Zhart = require('./Zhart.Core');
var DataSet = require('./Zhart.DataSet');
var Domain = require('./Zhart.Domain');
var _ = require('lodash');

var context = document.getElementById('zhart');
var context2 = document.getElementById('zhart2');

var now = Date.now();
var dataSets = [
    new DataSet([[now,0]]),
    new DataSet([[now,0]])
];

var xDomain = new Domain([now-20000, now-1000]);
xDomain.startTime();
var yDomain = new Domain([0,10]);

new Zhart({
    context: context2,
    width: 500,
    height: 300,
    dataSets: dataSets,
    xDomain: xDomain,
    yDomain: yDomain
}).microchart();


new Zhart({
    context: context,
    width: 500,
    height: 80,
    dataSets: dataSets,
    xDomain: xDomain,
    yDomain: yDomain
}).microchart();

// Crappy fake data
setInterval(function(){
    _.each(dataSets, function(set){
        set.push([_.last(set)[0]+1000, Math.random(10)*10]);
    });
},100);
