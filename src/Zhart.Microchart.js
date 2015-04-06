(function(root) {
'use strict';

var Zhart = root.Zhart
var features = Zhart.features('dragXDomain', 'dragYDomain');
var layers = Zhart.layers('xAxis', 'yAxis', 'area', 'line');

Zhart.prototype.Microchart = function (datasets, options) {
    var that = this;
    options = options || {};

    // TODO: extend current layers/features instead of overwriting
    this.layers = layers.slice();
    this.features = features.slice();

    // // Initializes new features
    _.each(features, function(feature){
        feature(that, datasets, options);
    });
}

}(this));