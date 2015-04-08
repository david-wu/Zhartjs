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


features.background = (function(options){

	// Options contains accessible feature attributes
	options = _.isObject(options) || {};
	_.defaults(options,{
		color: 'grey'
	});

	// Used to safely change options values
	function set(key, val){
		if(_.isUndefined(options[key])){
			throw new RangeError('set(key, val): Invalid key');
		}
		options[key] = val;
		return feature;
	}

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

	// Accessible options and functions
	var feature = {
		options: options,
		set: set,
		init: init,
		destroy: destroy
	};
	return feature;

})();


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

	// Used to safely change options values
	function set(key, val){
		if(_.isUndefined(options[key])){
			throw new RangeError('set(key, val): Invalid key');
		}
		options[key] = val;
		return feature;
	}

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
	};

	// Cleans up this feature
	function destroy(){
		if(textEl && _.isFunction(textEl.remove)){
			textEl.remove();
		}
	}

	// Accessible options and functions
	var feature = {
		options: options,
		set: set,
		init: init,
		destroy: destroy
	};
	return feature;

})();



features.dragXDomain = function(zhart){

	// Limit to one dragBehave per zhart.svg
	var dragBehave = zhart.svg.dragBehave || d3.behavior.drag();
	zhart.svg.dragBehave = dragBehave;

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

features.dragYDomain = function(zhart){

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
};

})(this);