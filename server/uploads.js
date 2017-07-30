import fs from 'fs-extra';
import path from 'path';

import Utils from './utils/serverUtils.js';

import { Locales } from '../imports/database/assets/locales';

Locales.allowClient();

Locales.on('afterUpload', (fileRef) => {
  // 'this' context is the Images (FilesCollection) instance
  let sourcePath = path.join(fileRef.path),
         newPath = path.join(Utils.getAssetSubfolder('i18n'), fileRef.name);

  let metadata = {
    'meta.type': 'locale',
    'meta.originalPath': sourcePath,
    'meta.referencePath': fileRef.name //Utils.getReferencePath(newPath)
  };

  fs.copySync(sourcePath, newPath);
  Locales.update(fileRef._id, { $set: metadata });
});