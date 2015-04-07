(function(root) {
'use strict';

/**
 * Creates the Zhart base class, initalize the svg on which to draw all
 * other graphs.
 * @param {svg}
 * @param {options}
 */

root.Zhart = function Zhart (zhart) {
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
        xDomain: new Domain(),
        yDomain: new Domain(),

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
        feature(that, that.datasets);
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
};

// Draws each layer
root.Zhart.prototype.redraw = function(){
    var that = this;

    this.resize();

    // TODO: Add autoScaling
    this.xScale.domain(this.xDomain);
    this.yScale.domain(this.yDomain);

    _.each(this.layers, function(layer){
        layer(that);
    });
};

// Resizes svg and vis based on width, height, and margins
root.Zhart.prototype.resize = function(){

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

}(this));

/*
    TODO: MOVE THIS STUFF OUT!
*/

function Domain(domain){
    domain = domain || [];
    this[0] = domain[0] || 0;
    this[1] = domain[1] || 15;
}
Domain.prototype = new Array(2);


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


