export default class Utils {
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

  // dgacitua: Get framed window
  // http://stackoverflow.com/a/10779201
  static getFramedWindow(f) {
    if (f.parentNode == null)
      f = document.body.appendChild(f);

    var w = (f.contentWindow || f.contentDocument);

    if (w && w.nodeType && w.nodeType==9)
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
  static notificationFadeout(messageDivId, duration) {
    // You will need to use this method with 'this.$scope.$apply()' for AngularJS Controllers
    var navbarMessageElement = angular.element(document.getElementById(messageDivId));
    navbarMessageElement.stop(true, true);
    navbarMessageElement.fadeIn(0);
    navbarMessageElement.fadeOut((duration ? duration*1000 : 5000));
  }

  // dgacitua: Hide current notification
  static notificationHide(messageDivId) {
    // You will need to use this method with 'this.$scope.$apply()' for AngularJS Controllers
    var navbarMessageElement = angular.element(document.getElementById(messageDivId));
    navbarMessageElement.stop(true, true);
    navbarMessageElement.hide();
  }

  // dgacitua: Check if element is an array
  static isArray(element) {
    return Array.isArray(element);
  }

  // dgacitua: Forces conversion of a single element into an array
  static forceArray(element) {
    if (Array.isArray(element)) {
      return element;
    }
    else {
      if (element == null) return [];
      else return [ element ];
    }
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

  // dgacitua: Check if user is logged in
  static isUserLoggedIn() {
    return !!Meteor.userId();
  }

  // dgacitua: Check if user is Admin/Researcher
  static isUserAdmin() {
    if (!!Meteor.userId()) {
      Meteor.call('userRole', (err, res) => {
        if (!err) {
          let result = (res === 'researcher');
          console.log('Current user is Admin/Researcher?', result);
          return result;
        }
        else {
          return false;
        }
      });
    }
    else {
      return false;
    }
  }
}