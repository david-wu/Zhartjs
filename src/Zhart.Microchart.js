(function(root) {
'use strict';

var Zhart = root.Zhart
var features = Zhart.features('background', 'text');
var layers = Zhart.layers('xAxis', 'yAxis', 'line', 'area');

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
        this.xScale.domain([0,10]);
        this.yScale.domain([0,10]);

        _.each(this.layers, function(layer){
            layer(that, datasets, options);
        });
    }

    // TODO: remove! (performance test)
    var t = Date.now();
    _.times(1000, function(){
        that.redraw();        
    });
    console.log('1000 redraws took: ', Date.now() - t, 'ms');
}

}(this));