export default ServerConfigs = {
  reloadProfilesOnDeploy: (Meteor.isProduction ? true : true),
  reloadQuestionsOnDeploy: (Meteor.isProduction ? true : true),
  reloadDocCollectionOnDeploy: (Meteor.isProduction ? true : true)
}