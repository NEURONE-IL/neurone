import LoggerConfigs from './loggerConfigs';

export default class Utils {
  // dgacitua: Convenience logging function to Javascript Console
  // http://stackoverflow.com/a/4116634
  static logToConsole(...messages) {
    if (LoggerConfigs.consoleLogging) {
      console.log(...messages);
    }
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