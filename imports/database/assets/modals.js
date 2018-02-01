import Utils from '../../utils/sharedUtils';

import { FilesCollection } from 'meteor/ostrio:files';

export const Modals = new FilesCollection({
  collectionName: 'Modals',
  storagePath: Utils.getAssetSubfolder('uploadedAssets/modals'),
  permissions: 0755,
  onBeforeUpload: (file) => {
    if (/html/i.test(file.extension)) return true;
    else return 'Invalid modal format';
  },
  onInitiateUpload: (file) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
          path = require('path');
      
      let newPath = path.join(Utils.getAssetSubfolder('modals'), file.name);
      if (fs.pathExistsSync(newPath)) Modals.remove({ 'meta.referencePath': Utils.getReferencePath(newPath) });
    }
  },
  onAfterUpload: (fileRef) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
        path = require('path');

      let newPath = path.join(Utils.getAssetSubfolder('modals'), fileRef.name),
       sourcePath = path.join(fileRef.path);

      let metadata = {
        'meta.type': 'modal',
        'meta.originalPath': sourcePath,
        'meta.referencePath': Utils.getReferencePath(newPath)
      };

      fs.copySync(sourcePath, newPath);
      Modals.update(fileRef._id, { $set: metadata });
    }
  },
  onAfterRemove: (files) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
          path = require('path');

      files.forEach((file, idx, arr) => {
        let newPath = path.join(Utils.getAssetSubfolder('modals'), file.name);
        if (fs.pathExistsSync(newPath)) fs.removeSync(newPath);
      });
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('modals', () => {
    return Modals.find().cursor;
  });
}