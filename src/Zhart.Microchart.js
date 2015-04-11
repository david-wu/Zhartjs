(function(root) {
'use strict';

var Zhart = root.Zhart

Zhart.prototype.Microchart = function(){
    var that = this;

	var features = Zhart.features('background', 'text', 'dragXDomain');
	features[0]
		.set('color', 'orange')
		.set('color', 'yellow');
	features[1]
		.set('color', 'purple')
		.set('x', 200);

	var layers = Zhart.layers('xAxis', 'yAxis', 'area', 'line');
	layers[0]
		.set('ticks', '5')
		.set('orient', 'bottom');
	layers[2]
		.set('interpolate', 'basis')
	layers[3]
		.set('interpolate', 'basis')

    // Initializes new features
    _.each(features, function(feature){
        feature.init(that);
    });

    // TODO: extend current layers/features instead of overwriting
    this.layers = layers.slice();
    this.features = features.slice();

}

}(this));
