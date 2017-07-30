import fs from 'fs-extra';
import path from 'path';

import Utils from './utils/serverUtils.js';

import { Locales } from '../imports/database/assets/locales';
import { Modals } from '../imports/database/assets/modals';
import { Templates } from '../imports/database/assets/templates';
import { Images } from '../imports/database/assets/images';

Locales.allowClient();
Modals.allowClient();
Templates.allowClient();
Images.allowClient();

Locales.on('afterUpload', (fileRef) => {
  // 'this' context is the Images (FilesCollection) instance
  let sourcePath = path.join(fileRef.path),
         newPath = path.join(Utils.getAssetSubfolder('i18n'), fileRef.name);

  let metadata = {
    'meta.type': 'locale',
    'meta.originalPath': sourcePath,
    'meta.referencePath': fileRef.name
  };

  fs.copySync(sourcePath, newPath);
  Locales.update(fileRef._id, { $set: metadata });
});

Modals.on('afterUpload', (fileRef) => {
  // 'this' context is the Images (FilesCollection) instance
  let sourcePath = path.join(fileRef.path),
         newPath = path.join(Utils.getAssetSubfolder('modals'), fileRef.name);

  let metadata = {
    'meta.type': 'modal',
    'meta.originalPath': sourcePath,
    'meta.referencePath': Utils.getReferencePath(newPath)
  };

  fs.copySync(sourcePath, newPath);
  Modals.update(fileRef._id, { $set: metadata });
});

Templates.on('afterUpload', (fileRef) => {
  // 'this' context is the Images (FilesCollection) instance
  let sourcePath = path.join(fileRef.path),
         newPath = path.join(Utils.getAssetSubfolder('templates'), fileRef.name);

  let metadata = {
    'meta.type': 'template',
    'meta.originalPath': sourcePath,
    'meta.referencePath': Utils.getReferencePath(newPath)
  };

  fs.copySync(sourcePath, newPath);
  Templates.update(fileRef._id, { $set: metadata });
});

Images.on('afterUpload', (fileRef) => {
  // 'this' context is the Images (FilesCollection) instance
  let sourcePath = path.join(fileRef.path),
         newPath = path.join(Utils.getAssetSubfolder('images'), fileRef.name);

  let metadata = {
    'meta.type': 'image',
    'meta.originalPath': sourcePath,
    'meta.referencePath': Utils.getReferencePath(newPath)
  };

  fs.copySync(sourcePath, newPath);
  Images.update(fileRef._id, { $set: metadata });
});