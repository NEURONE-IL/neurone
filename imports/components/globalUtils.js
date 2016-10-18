// TODO Define Global Utils
export default class Utils {
  // dgacitua: Get Unix timestamp
  static getTimestamp() {
    return Date.now ? Date.now() : (new Date().getTime());
  }
}