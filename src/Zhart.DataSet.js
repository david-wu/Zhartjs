var _ = require('lodash');

// Used to hold DataSet values
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

module.exports = DataSet;