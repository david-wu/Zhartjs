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

    // Determines which section of the chart to show
    this.xDomain = options.xDomain || new Domain();
    this.yDomain = options.yDomain || new Domain();

    return this;
}

}(this));

/*
    TODO: MOVE THIS STUFF OUT!
*/

function Domain(options){
    options = options || {};
    this.push(options.min || 0);
    this.push(options.max || 15);
}
Domain.prototype = new Array();


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


