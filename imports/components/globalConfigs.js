import Utils from './globalUtils';

export default ClientConfigs = {
  /* Configs for client */
  idleThreshold: 30,   // measured in seconds
  idleCheckInterval: 1,   // measured in seconds
  idleOnBlur: true,
  iframeId: 'pageContainer',
  flowEnabled: (Meteor.isProduction ? true : false),
  instructionTimeout: 3000,
  autoLogout: 15000,
  defaultLocale: 'en',
  /* Configs for Logger */
  consoleLogging: (Meteor.isDevelopment ? true : false),
  keyboardLogging: true,
  mouseCoordsLogging: true,
  mouseClicksLogging: true,
  iframeId: 'pageContainer',
  eventThrottle: 100    // Mousemove and scroll throttling in miliseconds, set to 0 for no throttling
}