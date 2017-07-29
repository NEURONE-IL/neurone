import Utils from '../../utils/sharedUtils';

const Templates = new FS.Collection('templates', {
  stores: [ new FS.Store.FileSystem('templates', { path: Utils.getAssetSubfolder('uploadedAssets/templates') }) ]
});

export default Templates;