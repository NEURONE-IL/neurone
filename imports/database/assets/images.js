/*
import { Mongo } from 'meteor/mongo';
import { UploadFS } from 'meteor/jalik:ufs';
import { LocalStore } from 'meteor/jalik:ufs-local';

import Utils from '../../utils/sharedUtils';

const Assets = new Mongo.Collection('assets');

const AssetStore = new LocalStore({
  collection: Assets,
  name: 'assets',
  path: Utils.getAssetSubfolder('uploadedAssets'),
  mode: '0744',
  writeMode: '0744'
});

export default AssetStore;
*/

import Utils from '../../utils/sharedUtils';

const Assets = new FS.Collection('images', {
  stores: [ new FS.Store.FileSystem('images', { path: Utils.getAssetSubfolder('uploadedAssets/images') }) ]
});

export default Assets;