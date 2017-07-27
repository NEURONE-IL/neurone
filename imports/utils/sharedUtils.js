import path from 'path';

export default class SharedUtils {
  static isTesting() {
    return Meteor.isTest || Meteor.isAppTest;
  }

  static getAssetPath() {
    if (this.isTesting()) {
      return path.join(Meteor.rootPath);
    }
    else {
      if (process.env.NEURONE_ASSET_PATH) {
        return process.env.NEURONE_ASSET_PATH;
      }
      else if (Meteor.isProduction || Meteor.isDevelopment) {
        return path.join(Meteor.rootPath, '../web.browser/app/');
      }
      else {
        return path.join(Meteor.rootPath);
      }
    }
  }

  static getAssetSubfolder(folder) {
    return path.join(this.getAssetPath(), folder);
  }

  static getPublicFolder() {
    if (Meteor.isProduction || Meteor.isDevelopment) {
      return path.join(Meteor.rootPath, '../web.browser/app/');
    }
    else {
      return path.join(Meteor.rootPath);
    }
  }
}