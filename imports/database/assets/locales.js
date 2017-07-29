import Utils from '../../utils/sharedUtils';

const Locales = new FS.Collection('locales', {
  stores: [ new FS.Store.FileSystem('locales', { path: Utils.getAssetSubfolder('i18n') }) ]
});

export default Locales;