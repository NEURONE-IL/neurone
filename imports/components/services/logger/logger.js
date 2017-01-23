import KMTrackService from './services/kmTrack';
import QueryTrackService from './services/queryTrack';
import LinkTrackService from './services/linkTrack';
import SessionTrackService from './services/sessionTrack';
import SnippetTrackService from './services/snippetTrack';
import BookmarkTrackService from './services/bookmarkTrack';
import EventTrackService from './services/eventTrack';

const name = 'logger';

export default angular.module(name, [])
.service('KMTrackService', KMTrackService)
.service('QueryTrackService', QueryTrackService)
.service('LinkTrackService', LinkTrackService)
.service('SessionTrackService', SessionTrackService)
.service('SnippetTrackService', SnippetTrackService)
.service('BookmarkTrackService', BookmarkTrackService)
.service('EventTrackService', EventTrackService);