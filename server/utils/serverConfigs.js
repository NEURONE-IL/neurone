export default ServerConfigs = {
  reloadProfilesOnDeploy: (Meteor.isProduction ? true : true),
  reloadQuestionsOnDeploy: (Meteor.isProduction ? true : false),
  reloadDocCollectionOnDeploy: (Meteor.isProduction ? true : true)
}