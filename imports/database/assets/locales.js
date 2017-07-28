import Utils from '../../utils/sharedUtils';

const Assets = new FS.Collection('locales', {
  stores: [ new FS.Store.FileSystem('locales', { path: Utils.getAssetSubfolder('i18n') }) ]
});

export default Assets;