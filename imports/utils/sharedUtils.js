import path from 'path';

const rootPath = path.resolve('.');
const absolutePath = rootPath.split(path.sep + '.meteor')[0];

export default class SharedUtils {
  static isTesting() {
    return Meteor.isTest || Meteor.isAppTest;
  }

  static getAssetPath() {
    if (this.isTesting()) {
      return rootPath;
    }
    else {
      if (process.env.NEURONE_ASSET_PATH) {
        return process.env.NEURONE_ASSET_PATH;
      }
      else if (Meteor.isProduction || Meteor.isDevelopment) {
        return path.join(rootPath, '../web.browser/app/');
      }
      else {
        return path.join(rootPath);
      }
    }
  }

  static getAssetSubfolder(newPath) {
    return path.join(this.getAssetPath(), newPath);
  }

  static getPublicFolder() {
    if (Meteor.isProduction || Meteor.isDevelopment) {
      return path.join(rootPath, '../web.browser/app/');
    }
    else {
      return path.join(rootPath);
    }
  }
}