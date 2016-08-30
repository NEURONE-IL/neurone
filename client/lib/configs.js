LOGGING = true;
TRACKING_GLOBAL = true;
TRACKING_SNIPPETS = true;
TRACKING_LINKS = true;
TRACKING_KEYBOARD = true;
TRACKING_MOUSE = true;

// dgacitua: Convenience logging function to Javascript Console
logToConsole = function(message) {
  if (LOGGING) {
    console.log(message);
  }
}

// dgacitua: Check if string is empty
// http://stackoverflow.com/a/3261380
isEmpty = function(str) {
    return (!str || 0 === str.length);
};