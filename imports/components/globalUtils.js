// TODO Define Global Utils
export default class Utils {
  // dgacitua: Get Unix timestamp
  static getTimestamp() {
    return Date.now ? Date.now() : (new Date().getTime());
  }

  // dgacitua: Convert string to integer, else return it as string
  static parseStringAsInteger(str) {
    if (typeof str === 'string' || str instanceof String) {
      if (!isNaN(str)) {
        return parseInt(str, 10);
      }
      else {
        return str.toString();
      }  
    }
    else {
      return str;
    }
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