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

/*
const localeStore = new FS.Store.FileSystem('locales', {
  path: Utils.getAssetSubfolder('uploadedAssets/locales'),
});

export const Locales = new FS.Collection('locales', {
  stores: [ localeStore ],
  filter: {
    allow: {
      contentTypes: ['application/json'],
      extensions: ['json']
    }
  }
});
*/