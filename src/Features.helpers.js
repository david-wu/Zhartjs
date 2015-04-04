(function(root){

/*
	features lets you retrieve the corresponding features functions
	feature functions are run when the chart is initialized

	Zhart.features('xAxis', 'yAxis', 'line')
		=> [func, func, func]

	Zhart.features['xAxis']
		=> func
*/

var Zhart = root.Zhart;

Zhart.features = function(){
	return _.map(arguments, function(str){
		return Zhart.features[str];
	});
};

var features = Zhart.features;

features.background = function background(zhart, datasets, options) {
    var bgColor = options.bgColor || 'black';
    zhart.svg
        .style('background-color', bgColor);
};

features.text = function text (zhart, datasets, options) {
    var text = options.text || 'what';
    zhart.svg.append('text')
        .attr('x', zhart.width/2)
        .attr('y', zhart.height/2)
        .text(text);
};

features.dragXDomain = function dragXDomain(zhart, datasets, options){

	// Limit to one dragBehave per zhart.svg
	var dragBehave = zhart.svg.dragBehave || d3.behavior.drag();
	zhart.svg.dragBehave = dragBehave

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
};

features.dragYDomain = function dragYDomain(zhart, datasets, options){

	// Limit to one dragBehave per zhart.svg
	var dragBehave = zhart.svg.dragBehave || d3.behavior.drag();
	zhart.svg.dragBehave = dragBehave

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
};

})(this);