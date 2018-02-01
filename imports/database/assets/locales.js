import Utils from '../../utils/sharedUtils';

import { FilesCollection } from 'meteor/ostrio:files';

export const Locales = new FilesCollection({
  collectionName: 'Locales',
  storagePath: Utils.getAssetSubfolder('uploadedAssets/locales'),
  permissions: 0755,
  onBeforeUpload: (file) => {
    if (/json/i.test(file.extension)) return true;
    else return 'Invalid locale format';
  },
  onInitiateUpload: (file) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
          path = require('path');
      
      let newPath = path.join(Utils.getAssetSubfolder('i18n'), file.name);
      if (fs.pathExistsSync(newPath)) Locales.remove({ 'meta.referencePath': Utils.getReferencePath(newPath) });
    }
  },
  onAfterUpload: (fileRef) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
        path = require('path');

      let newPath = path.join(Utils.getAssetSubfolder('i18n'), fileRef.name),
       sourcePath = path.join(fileRef.path);

      let metadata = {
        'meta.type': 'locale',
        'meta.originalPath': sourcePath,
        'meta.referencePath': Utils.getReferencePath(newPath)
      };

      fs.copySync(sourcePath, newPath);
      Locales.update(fileRef._id, { $set: metadata });
    }
  },
  onAfterRemove: (files) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
          path = require('path');

      files.forEach((file, idx, arr) => {
        let newPath = path.join(Utils.getAssetSubfolder('i18n'), file.name);
        if (fs.pathExistsSync(newPath)) fs.removeSync(newPath);
      });
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('locales', () => {
    return Locales.find().cursor;
  });
}