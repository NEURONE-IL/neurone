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
}