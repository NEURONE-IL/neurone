import Utils from '../../utils/sharedUtils';

import { FilesCollection } from 'meteor/ostrio:files';

export const Templates = new FilesCollection({
  collectionName: 'Templates',
  storagePath: Utils.getAssetSubfolder('uploadedAssets/templates'),
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
  Meteor.publish('templates', () => {
    return Templates.find().cursor;
  });
}