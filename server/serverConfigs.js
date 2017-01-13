export default ServerConfigs = {
  reloadDocCollectionOnDeploy: (Meteor.isProduction ? true : false),
  reloadQuestionsOnDeploy: (Meteor.isProduction ? true : true)
}