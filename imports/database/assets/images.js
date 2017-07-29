import Utils from '../../utils/sharedUtils';

const Images = new FS.Collection('images', {
  stores: [ new FS.Store.FileSystem('images', { path: Utils.getAssetSubfolder('uploadedAssets/images') }) ]
});

export default Images;