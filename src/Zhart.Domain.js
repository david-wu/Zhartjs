var _ = require('lodash');

function Domain(domain){
  if(!domain || !_.isArray(domain) || domain.length!==2 ){
    console.log(domain);
    throw new RangeError('Invalid Domain');
  }
  domain.startTime = startTime;
  domain.stopTime = stopTime;
  return domain;
}
function startTime(){
  var that = this;
  this.stopTime();
  var time = Date.now();
  this.realTimeInterval = setInterval(function(){
    var timePassed = Date.now()-time;
    that[0] += timePassed;
    that[1] += timePassed;
    time = Date.now();
  },16);
}
function stopTime(){
  clearInterval(this.realTimeInterval);
  this.realTimeInterval = null;
}

module.exports = Domain;