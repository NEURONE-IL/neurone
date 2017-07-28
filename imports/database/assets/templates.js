import Utils from '../../utils/sharedUtils';

const Assets = new FS.Collection('templates', {
  stores: [ new FS.Store.FileSystem('templates', { path: Utils.getAssetSubfolder('uploadedAssets/templates') }) ]
});

export default Assets;