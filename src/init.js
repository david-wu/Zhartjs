var Zhart = require('./Zhart.Core');
var DataSet = require('./Zhart.DataSet');
var Domain = require('./Zhart.Domain');
var _ = require('lodash');

var context = document.getElementById('zhart');
var context2 = document.getElementById('zhart2');

var now = Date.now();
var dataSets = [
    new DataSet([[now,0]]),
    new DataSet([[now,0]])
];

var xDomain = new Domain([now-20000, now-1000]);
xDomain.startTime();
var yDomain = new Domain([0,10]);

new Zhart({
    context: context2,
    width: 500,
    height: 300,
    dataSets: dataSets,
    xDomain: xDomain,
    yDomain: yDomain
}).microchart();


new Zhart({
    context: context,
    width: 500,
    height: 80,
    dataSets: dataSets,
    xDomain: xDomain,
    yDomain: yDomain
}).microchart();

// Crappy fake data
setInterval(function(){
    _.each(dataSets, function(set){
        set.push([_.last(set)[0]+1000, Math.random(10)*10]);
    });
},100);