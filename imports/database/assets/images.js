import Utils from '../../utils/sharedUtils';

import { FilesCollection } from 'meteor/ostrio:files';

export const Images = new FilesCollection({
  collectionName: 'Images',
  storagePath: Utils.getAssetSubfolder('uploadedAssets/images'),
  permissions: 0755,
  onBeforeUpload: (file) => {
    if (/jpg|png|gif/i.test(file.extension)) return true;
    else return 'Invalid image format';
  },
  onInitiateUpload: (file) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
          path = require('path');
      
      let newPath = path.join(Utils.getAssetSubfolder('images'), file.name);
      if (fs.pathExistsSync(newPath)) Images.remove({ 'meta.referencePath': Utils.getReferencePath(newPath) });
    }
  },
  onAfterUpload: (fileRef) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
        path = require('path');

      let newPath = path.join(Utils.getAssetSubfolder('images'), fileRef.name),
       sourcePath = path.join(fileRef.path);

      let metadata = {
        'meta.type': 'image',
        'meta.originalPath': sourcePath,
        'meta.referencePath': Utils.getReferencePath(newPath)
      };

      fs.copySync(sourcePath, newPath);
      Images.update(fileRef._id, { $set: metadata });
    }
  },
  onAfterRemove: (files) => {
    if (Meteor.isServer) {
      const fs = require('fs-extra'),
          path = require('path');

      files.forEach((file, idx, arr) => {
        let newPath = path.join(Utils.getAssetSubfolder('images'), file.name);
        if (fs.pathExistsSync(newPath)) fs.removeSync(newPath);
      });
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('images', () => {
    return Images.find().cursor;
  });
}