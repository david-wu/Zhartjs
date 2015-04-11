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