import Configs from './globalConfigs';

export default class LogUtils {
  // dgacitua: Convenience logging functions to Javascript Console
  // http://stackoverflow.com/a/4116634
  static logToConsole(...messages) {
    if (Configs.consoleLogging) {
      console.log(...messages);
    }
  }

  static warnToConsole(...messages) {
    if (Configs.consoleLogging) {
      console.warn(...messages);
    }
  }

  static errorToConsole(...messages) {
    if (Configs.consoleLogging) {
      console.error(...messages);
    }
  }
}