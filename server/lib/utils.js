import fs from 'fs';
import path from 'path';

export default class ServerUtils {
  constructor() {}

  // dgacitua: Check if string is empty
  // http://stackoverflow.com/a/3261380
  static isEmpty(str) {
    return (!str || 0 === str.length);
  } 

  static getTimestamp() {
    return Date.now ? Date.now() : (new Date().getTime());  
  }

  static getDate() {
    var date = new Date();
    return date.toString();
  }

  static timestamp2datetime(timestamp) {
    var date = new Date(timestamp);
    return date;
  }

  static timestamp2date(timestamp) {
    return moment(timestamp).format("YYYY-MM-DD");
  }

  static timestamp2time(timestamp) {
    return moment(timestamp).format("HH:mm:ss.SSS");
  }

  static isEmptyObject(obj) {
    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  }

  static getAssetPath() {
    if (process.env.NEURONE_ASSET_PATH) {
      return process.env.NEURONE_ASSET_PATH;
    }
    else {
      if (Meteor.isProduction) {
        return path.join(Meteor.rootPath, '../web.browser/app/');
      }
      else if (Meteor.isTest || Meteor.isAppTest) {
        return path.join(Meteor.rootPath);
      }
      else {
        return path.join(Meteor.absolutePath, '/public/');
      }
    }
  }
}