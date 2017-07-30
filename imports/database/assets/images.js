import Utils from '../../utils/sharedUtils';

/*
const imagePath = Utils.getAssetSubfolder('uploadedAssets/images');

export const Images = new FS.Collection('images', {
  stores: [ new FS.Store.FileSystem('images', { path: imagePath }) ]
});

if (Meteor.isServer) {
  Images.allow({
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