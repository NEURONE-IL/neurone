import Utils from '../../utils/sharedUtils';

const Assets = new FS.Collection('images', {
  stores: [ new FS.Store.FileSystem('images', { path: Utils.getAssetSubfolder('uploadedAssets/images') }) ]
});

export default Assets;