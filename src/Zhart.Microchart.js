(function(root) {
'use strict';

var Zhart = root.Zhart
var features = Zhart.features('background', 'text', 'dragXDomain', 'dragYDomain');
features[0]
	.set('color', 'orange')
	.set('color', 'yellow');
features[1]
	.set('color', 'purple')
	.set('x', 200);


var layers = Zhart.layers('xAxis', 'yAxis', 'area', 'line');

Zhart.prototype.Microchart = function(){
    var that = this;

    // Initializes new features
    _.each(features, function(feature){
        feature.init(that);
    });

    // TODO: extend current layers/features instead of overwriting
    this.layers = layers.slice();
    this.features = features.slice();

}

}(this));