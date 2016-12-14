// TODO Define Global Utils
export default class Utils {
  // dgacitua: Convenience logging functions to Javascript Console
  // http://stackoverflow.com/a/4116634
  static logToConsole(...messages) {
    if (LoggerConfigs.consoleLogging) {
      console.log(...messages);
    }
  }

  static warnToConsole(...messages) {
    if (LoggerConfigs.consoleLogging) {
      console.warn(...messages);
    }
  }

  static errorToConsole(...messages) {
    if (LoggerConfigs.consoleLogging) {
      console.error(...messages);
    }
  }

  // dgacitua: Get Unix timestamp
  static getTimestamp() {
    return Date.now ? Date.now() : (new Date().getTime());
  }

  // dgacitua: Convert string to integer, else return it as string
  static parseStringAsInteger(str) {
    if (typeof str === 'string' || str instanceof String) {
      if (!isNaN(str)) return parseInt(str, 10);
      else return str.toString();
    }
    else {
      return str;
    }
  }

  // dgacitua: Get Unix timestamp
  static getTimestamp() {
    return Date.now ? Date.now() : (new Date().getTime());
  }

  static getAngularElementById(elementId) {
    var aux = document.getElementById(elementId);

    if (typeof(aux) != 'undefined' && aux != null) return angular.element(aux);
    else return null;
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

  // dgacitua: Convert seconds to milliseconds
  static sec2millis(seconds) {
    return seconds*1000;
  }

  // dgacitua: Convert minutes to milliseconds
  static min2millis(minutes) {
    return minutes*60*1000;
  }

  // dgacitua: Set a fade out message for notifications
  static notificationFadeout(messageDivId) {
    // You will need to use this method with 'this.$scope.$apply()' for AngularJS Controllers
    var navbarMessageElement = angular.element(document.getElementById(messageDivId));
    navbarMessageElement.stop(true, true);
    navbarMessageElement.fadeIn(0);
    navbarMessageElement.fadeOut(5000);
  }

  // dgacitua: Set a fade out message for notifications
  static notificationHide(messageDivId) {
    // You will need to use this method with 'this.$scope.$apply()' for AngularJS Controllers
    var navbarMessageElement = angular.element(document.getElementById(messageDivId));
    navbarMessageElement.stop(true, true);
    navbarMessageElement.hide();
  }

  // dgacitua: Check if string is empty
  // http://stackoverflow.com/a/3261380
  static isEmpty(str) {
    return (!str || 0 === str.length);
  }

  static isEmptyObject(object) {
    return angular.equals(object, {});
  }

  // dgacitua: http://stackoverflow.com/a/12975295
  static countWords(string) {
    return string.match(/\S+/g).length;
  }
}