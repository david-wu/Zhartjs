(function(root) {
'use strict';

/**
 * Creates the Zhart base class, initalize the svg on which to draw all
 * other graphs.
 * @param {svg}
 * @param {options}
 */
root.Zhart = function Zhart (context, options) {
    if (!options) { options = {} };
    this.width = options.width
        || document.defaultView.getComputedStyle(context).getPropertyValue('Width');
    this.height = options.height
        || document.defaultView.getComputedStyle(context).getPropertyValue('Height');
    this.aspectRatio = this.width / this.height;

    this.svg = d3.select(context)
        .append('svg')
        .classed('zhart', true)
        .attr('width', this.width)
        .attr('height', this.height);
    return this;
}

Zhart.features = {

}

}(this));