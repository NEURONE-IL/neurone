import Utils from '../../utils/sharedUtils';

/*
const templatePath = Utils.getAssetSubfolder('uploadedAssets/templates');

export const Templates = new FS.Collection('templates', {
  stores: [ new FS.Store.FileSystem('templates', { path: templatePath }) ]
});

if (Meteor.isServer) {
  Templates.allow({
    insert(userId, fileObj) {
      return true;
    },
    update(userId, fileObj) {
      return true;
    },
    remove(userId, fileObj) {
      return true;
    },
    download() {
      return true;
    }
  });
}
*/