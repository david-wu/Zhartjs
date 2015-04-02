(function(root) {
'use strict';

/**
 * Creates the Zhart base class, initalize the svg on which to draw all
 * other graphs.
 * @param {svg}
 * @param {options}
 */
root.Zhart = function Zhart (context, options) {

    options = options || {};

    var svgWidth = options.width
        || document.defaultView.getComputedStyle(context).getPropertyValue('Width');

    var svgHeight = options.height
        || document.defaultView.getComputedStyle(context).getPropertyValue('Height');

    this.svg = d3.select(context)
        .append('svg')
        .classed('zhart', true)
        .attr('width', svgWidth)
        .attr('height', svgHeight)

    // Margins seperate the labels, and axis from the center of the graph
    this.margins = options.margins || {
        top: 10,
        left: 30,
        bottom: 30,
        right:10
    };

    // Contains most graphics, leaving margin room
    this.width = svgWidth-this.margins.left-this.margins.right;
    this.height = svgHeight-this.margins.top-this.margins.bottom;
    this.vis = this.svg.append('g')
        .classed('vis', true)
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', 'translate('+this.margins.left+','+this.margins.top+')');

    // Scales used to draw within vis
    this.yScale = d3.scale.linear()
        .range([this.height, 0]);

    this.xScale = d3.scale.linear()
        .range([0, this.width]);

    return this;
}

Zhart.features = {

}

}(this));