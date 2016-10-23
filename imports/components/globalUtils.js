// TODO Define Global Utils
export default class Utils {
  // dgacitua: Get Unix timestamp
  static getTimestamp() {
    return Date.now ? Date.now() : (new Date().getTime());
  }

  // dgacitua: Convert string to integer, else return it as string
  static parseStringAsInteger(str) {
    if (!isNaN(str)) {
      return parseInt(str, 10);
    }
    else {
      return str;
    }
  }
}