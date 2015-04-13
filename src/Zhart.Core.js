var _ = require('lodash');
var d3 = require('d3');
Zhart.Domain = Domain = require('./Zhart.Domain');
Zhart.DataSet = DataSet = require('./Zhart.DataSet');
Zhart.Features = Features = require('./Features.helpers');
Zhart.Layers = Layers = require('./Layers.helpers');

/**
 * Creates the Zhart base class
 */
function Zhart(zhart){
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
        xDomain: new Zhart.Domain([0,10]),
        yDomain: new Zhart.Domain([0,10])
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

    // Used to clip the graph to only draw within a rect
    this.clipper = this.svg.append('defs')
        .append('clipPath')
            .attr('id', 'clipper')
            .append('rect')

    // Initializes features
    _.each(this.features, function(feature){
        feature.init(that);
    });

    // TODO: remove! (performance test)
    var tTime = 0;
    setInterval(function () {
        var t = Date.now();
        that.redraw();
        tTime += (Date.now() -  t);
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

    _.each(this.Layers, function(layer){
        layer.draw(that);
    });
};

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

    this.clipper
        .attr('width', this.visWidth)
        .attr('height', this.visHeight)

    // Redefine scales used for drawing
    this.yScale
        .range([this.visHeight, 0]);
    this.xScale
        .range([0, this.visWidth]);            
};

// Apply preset features and layers
Zhart.prototype.microchart = function(){
  var that = this;

  var features = Zhart.Features('background', 'text', 'dragXDomain');
  features[0]
    .set('color', 'orange');
  features[1]
    .set('color', 'purple')
    .set('x', 200);

  var layers = Zhart.Layers('xAxis', 'yAxis', 'area', 'line');
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
  this.Layers = layers.slice();
  this.features = features.slice();
};

module.exports = Zhart;
