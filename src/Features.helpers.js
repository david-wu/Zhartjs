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

	// Defines dragBehavior
	var dragXDomain = d3.behavior.drag()
		.on("dragstart", dragStart)
		.on("drag", drag)
		.on("dragend", dragEnd);
	function dragStart(d) {
		d3.event.sourceEvent.stopPropagation();
		d3.select(this)
			.classed("dragging", true);
	}
	function drag(d) {
		var xShift = zhart.xScale.invert(0) - zhart.xScale.invert(d3.event.dx);
		zhart.xDomain[0] += xShift;
		zhart.xDomain[1] += xShift;
	}
	function dragEnd(d) {
		d3.select(this)
			.classed("dragging", false);
	}

	zhart.svg.call(dragXDomain);
};

})(this);