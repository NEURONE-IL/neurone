import Utils from '../../utils/sharedUtils';

import { FilesCollection } from 'meteor/ostrio:files';

export const Images = new FilesCollection({
  collectionName: 'Images',
  storagePath: Utils.getAssetSubfolder('uploadedAssets/images'),
  permissions: 0755,
  onBeforeUpload: (file) => {
    if (/jpg|png|gif/i.test(file.extension)) {
      return true;
    }
    else {
      return 'Invalid image format';
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('images', () => {
    return Images.find().cursor;
  });
}