(function(root) {
'use strict';

var Zhart = root.Zhart
var features = Zhart.features('background', 'text', 'dragXDomain');
var layers = Zhart.layers('xAxis', 'yAxis', 'area', 'line');

Zhart.prototype.Microchart = function (datasets, options) {
    var that = this;
    options = options || {};

    // Each microchart has its own layers
    this.layers = layers.slice();

    // Initializes features
    _.each(features, function(feature){
        feature(that, datasets, options);
    })

    // Draws each layer
    this.redraw = function(){

        // TODO: Add autoScaling
        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);

        _.each(this.layers, function(layer){
            layer(that, datasets, options);
        });
    }

    // TODO: remove! (performance test)
    var t = Date.now();
    _.times(100, function(){
        that.redraw();        
    });
    console.log('100 redraws took:', Date.now() - t, 'ms');

    setInterval(function () {
        that.redraw();
    }, 16);
}

}(this));