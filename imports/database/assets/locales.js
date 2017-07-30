import Utils from '../../utils/sharedUtils';

import { FilesCollection } from 'meteor/ostrio:files';

export const Locales = new FilesCollection({
  collectionName: 'Locales',
  storagePath: Utils.getAssetSubfolder('uploadedAssets/locales'),
  permissions: 0755,
  onBeforeUpload: (file) => {
    if (/json/i.test(file.extension)) {
      return true;
    }
    else {
      return 'Invalid JSON format';
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('locales', () => {
    return Locales.find().cursor;
  });
}