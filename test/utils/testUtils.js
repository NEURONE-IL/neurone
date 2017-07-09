export default class TestUtils {
  static getTimestamp() {
    return Date.now ? Date.now() : (new Date().getTime());
  }
}