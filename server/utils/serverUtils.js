import fs from 'fs';
import path from 'path';

const rootPath = path.resolve('.');
const absolutePath = rootPath.split(path.sep + '.meteor')[0];

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

  // dgacitua: Move element in array from one position to another
  // http://stackoverflow.com/a/5306832
  static moveInArray(array, old_index, new_index) {
    while (old_index < 0) {
      old_index += array.length;
    }
    while (new_index < 0) {
      new_index += array.length;
    }
    if (new_index >= array.length) {
      var k = new_index - array.length;
      while ((k--) + 1) {
        array.push(undefined);
      }
    }
    
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);

    return array;
  }

  // dgacitua: Check if variable is a string
  // http://stackoverflow.com/a/9436948
  static isString(testStr) {
    return (typeof testStr === 'string' || testStr instanceof String);
  }

  static isTesting() {
    return Meteor.isTest || Meteor.isAppTest;
  }

  static getAssetPath() {
    if (this.isTesting()) {
      return rootPath;
    }
    else {
      if (process.env.NEURONE_ASSET_PATH) {
        return process.env.NEURONE_ASSET_PATH;
      }
      else if (Meteor.isProduction || Meteor.isDevelopment) {
        return path.join(rootPath, '../web.browser/app/');
      }
      else {
        return path.join(rootPath);
      }
    }
  }

  static getAssetSubfolder(newPath) {
    return path.join(this.getAssetPath(), newPath);
  }

  static getReferencePath(newPath) {
    return path.join('assets', path.normalize(path.relative(this.getAssetPath(), newPath)));
  }

  static getPublicFolder() {
    if (Meteor.isProduction || Meteor.isDevelopment) {
      return path.join(rootPath, '../web.browser/app/');
    }
    else {
      return path.join(rootPath);
    }
  }
}