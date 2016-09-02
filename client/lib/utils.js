// dgacitua: Convenience logging function to Javascript Console
exports.logToConsole = function(message) {
  if (LOGGING) {
    console.log(message);
  }
};

// dgacitua: Check if string is empty
// http://stackoverflow.com/a/3261380
exports.isEmpty = function(str) {
    return (!str || 0 === str.length);
};

// dgacitua: Get Unix timestamp
exports.getTimestamp = function() {
  return Date.now ? Date.now() : (new Date().getTime());
};

// dgacitua: Convert Unix timestamp to Datetime
// https://gist.github.com/kmaida/6045266
exports.convertTimestamp = function(timestamp) {
  var d = new Date(Number(timestamp)),
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),     // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),   // Add leading 0.
    ampm = 'AM',
    time;

  console.log(d);
      
  if (hh > 12) {
    h = hh - 12;
    ampm = 'PM';
  } else if (hh === 12) {
    h = 12;
    ampm = 'PM';
  } else if (hh == 0) {
    h = 12;
  }
  
  // ie: 2013-02-18, 8:35 AM  
  time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

  return time;
};