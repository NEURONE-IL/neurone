export default LoggerConfigs = {
  consoleLogging: false, //(Meteor.isDevelopment ? true : false),
  keyboardLogging: true,
  mouseCoordsLogging: true,
  mouseClicksLogging: true,
  iframeId: 'pageContainer',
  eventThrottle: 100		// Mousemove and scroll throttling in miliseconds, set to 0 for no throttling
}