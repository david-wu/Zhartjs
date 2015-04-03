(function(root){

/*
	layers lets you retrieve the corresponding layer functions
	layer functions draw stuff on the chart everytime the chart is redrawn

	Zhart.layers('xAxis', 'yAxis', 'line')
		=> [func, func, func]

	Zhart.layers['xAxis']
		=> func
*/

var Zhart = root.Zhart;

Zhart.layers = function(){
	return _.map(arguments, function(str){
		return Zhart.layers[str];
	});
};

var layers = Zhart.layers;

// A layer that draws the xAxis
layers.xAxis = function xAxis(zhart){
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
};

// A layer that draws the yAxis
layers.yAxis = function yAxis(zhart){
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
};

// A layer that draws lines for linegraph
layers.line = function line(zhart, datasets){

    // Accepts data and returns a line path
    var lineFunc = d3.svg.line()
        .x(function(d){return zhart.xScale(d[0]);})
        .y(function(d){return zhart.yScale(d[1]);});

    // Accepts data and generates a class name
    var classFunc = function(d, index){
        return 'line '+index;
    }

    // Selects lines
    var lines = zhart.vis.selectAll('path.line')
        .data(datasets)

    // Initializes lines
    lines.enter()
        .append('svg:path')
            // TODO: Improve classFunc and put these things in scss
            .style('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5);

    // Updates lines
    lines
        .attr('d', lineFunc)
        .attr('class', classFunc);

    // Removes lines if they don't exist
    lines
        .exit()
            .remove();

};

// A function that draws an area for linegraph
layers.area = function area(zhart, datasets){

    // Accepts data and returns a line path
    var areaFunc = d3.svg.area()
        .x(function(d){return zhart.xScale(d[0]);})
        .y0(function(){return zhart.yScale(0);})
        .y1(function(d){return zhart.yScale(d[1]);});

    // Accepts data and generates a class name
    var classFunc = function(d, index){
        return 'area '+index;
    }

    // Selects areas
    var areas = zhart.vis.selectAll('path.area')
        .data(datasets);

    // Initializes areas
    areas.enter()
        .append('svg:path')
            // TODO: Improve classFunc and put these things in scss
            .style('fill', 'red')
            .style('opacity', 0.5)
            .attr('stroke', 'none')
            .attr('stroke-width', 0)
            .on('mouseover', function(){
                console.log('ZHART')
            });

    // Update areas
    areas
        .attr('d', areaFunc)
        .attr('class', classFunc);

    // Removes areas if they don't exist
    areas
        .exit()
            .remove();

};

})(this);