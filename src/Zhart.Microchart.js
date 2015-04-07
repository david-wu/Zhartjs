(function(root) {
'use strict';

var Zhart = root.Zhart
var features = Zhart.features('dragXDomain', 'dragYDomain');
var layers = Zhart.layers('xAxis', 'yAxis', 'area', 'line');

Zhart.prototype.Microchart = function(){
    var that = this;

    // Initializes new features
    _.each(features, function(feature){
        feature(that);
    });

    // TODO: extend current layers/features instead of overwriting
    this.layers = layers.slice();
    this.features = features.slice();

}

}(this));