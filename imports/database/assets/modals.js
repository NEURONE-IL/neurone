import Utils from '../../utils/sharedUtils';

import { FilesCollection } from 'meteor/ostrio:files';

export const Modals = new FilesCollection({
  collectionName: 'Modals',
  storagePath: Utils.getAssetSubfolder('uploadedAssets/modals'),
  permissions: 0755,
  onBeforeUpload: (file) => {
    if (/html/i.test(file.extension)) {
      return true;
    }
    else {
      return 'Invalid HTML format';
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('modals', () => {
    return Modals.find().cursor;
  });
}