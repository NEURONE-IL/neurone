// TODO Define Global Configs
export default ClientConfigs = {
  idleThreshold: 30,   // measured in seconds
  idleCheckInterval: 1,   // measured in seconds
  idleOnBlur: true,
  iframeId: 'pageContainer',
  flowEnabled: (Meteor.isProduction ? true : false),
  instructionTimeout: 3000,
  autoLogout: 15000,
  defaultLocale: 'fi'
}