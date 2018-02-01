import Utils from '../../utils/sharedUtils';

import { FilesCollection } from 'meteor/ostrio:files';

export const Templates = new FilesCollection({
  collectionName: 'Templates',
  storagePath: Utils.getAssetSubfolder('uploadedAssets/templates'),
  permissions: 0755,
  onBeforeUpload: (file) => {
    if (/html/i.test(file.extension)) return true;
    else return 'Invalid template format';
  },
  onInitiateUpload: (file) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
          path = require('path');
      
      let newPath = path.join(Utils.getAssetSubfolder('templates'), file.name);
      if (fs.pathExistsSync(newPath)) Templates.remove({ 'meta.referencePath': Utils.getReferencePath(newPath) });
    }
  },
  onAfterUpload: (fileRef) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
        path = require('path');

      let newPath = path.join(Utils.getAssetSubfolder('templates'), fileRef.name),
       sourcePath = path.join(fileRef.path);

      let metadata = {
        'meta.type': 'template',
        'meta.originalPath': sourcePath,
        'meta.referencePath': Utils.getReferencePath(newPath)
      };

      fs.copySync(sourcePath, newPath);
      Templates.update(fileRef._id, { $set: metadata });
    }
  },
  onAfterRemove: (files) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
          path = require('path');

      files.forEach((file, idx, arr) => {
        let newPath = path.join(Utils.getAssetSubfolder('templates'), file.name);
        if (fs.pathExistsSync(newPath)) fs.removeSync(newPath);
      });
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('templates', () => {
    return Templates.find().cursor;
  });
}