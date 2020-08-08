const format = (seconds) => {
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

const rollDice = () => Math.floor(Math.random() * 6) + 1;

var today = new Date();
const time = () => today.getHours() + ":" + today.getMinutes()

// Sory array by property
// sortArrayBy('property', boolean, primer)
const sortArrayBy = (field, reverse, primer) => {

  var key = primer ? function (x) { 
    return primer(x[field]); 
  } 
    : function (x) { 
      return x[field]; 
    }
  reverse = !reverse ? 1 : -1;
  return function(a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}

exports.helpers = {time, rollDice, format, sortArrayBy};
