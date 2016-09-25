import './configs.js';

export default class Utils {
  // dgacitua: Convenience logging function to Javascript Console
  static logToConsole(message) {
    console.log(message);
  }

  // dgacitua: Check if string is empty
  // http://stackoverflow.com/a/3261380
  static isEmpty(str) {
      return (!str || 0 === str.length);
  }

  // dgacitua: Get Unix timestamp
  static getTimestamp() {
    return Date.now ? Date.now() : (new Date().getTime());
  }

  static getAngularElementById(elementId) {
    var aux = document.getElementById(elementId);

    if (typeof(aux) != 'undefined' && aux != null) {
      return angular.element(aux);
    }
    else {
      return null;
    }
  }

  // From http://stackoverflow.com/a/10779201
  static getFramedWindow(f) {
    if(f.parentNode == null)
      f = document.body.appendChild(f);

    var w = (f.contentWindow || f.contentDocument);

    if(w && w.nodeType && w.nodeType==9)
        w = (w.defaultView || w.parentWindow);

    return w;
  }
}