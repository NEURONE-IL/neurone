/*
  Database definitions for NEURONE
*/

// Admin Module Components
export { FlowComponents } from '../../imports/database/flowComponents/index';
export { FlowElements } from '../../imports/database/flowElements/index';

// Assets
export { Locales } from '../../imports/database/assets/locales';
export { Modals } from '../../imports/database/assets/modals';
export { Templates } from '../../imports/database/assets/templates';
export { Images } from '../../imports/database/assets/images';

// Information Retrieval
export { Documents } from '../../imports/database/documents/index';
export { Indexes } from '../../imports/database/indexes/index';
export { UserData } from '../../imports/database/userData/index';
export { Identities } from '../../imports/database/identities/index';
export { Settings } from '../../imports/database/settings/index';

// Event Logs
export { Snippets } from '../../imports/database/snippets/index';
export { Queries } from '../../imports/database/queries/index';
export { Bookmarks } from '../../imports/database/bookmarks/index';
export { VisitedLinks } from '../../imports/database/visitedLinks/index';
export { SessionLogs } from '../../imports/database/sessionLogs/index';
export { EventLogs } from '../../imports/database/eventLogs/index';
export { Counters } from './serverCollections';

// Input Tracking
export { Keystrokes } from '../../imports/database/keystrokes/index';
export { MouseClicks } from '../../imports/database/mouseClicks/index';
export { MouseCoordinates } from '../../imports/database/mouseCoordinates/index';
export { ScrollMoves } from '../../imports/database/scrollMoves/index';

// Questions, Questionnaires and Answers
export { FormQuestions } from '../../imports/database/formQuestions/index';
export { FormQuestionnaires } from '../../imports/database/formQuestionnaires/index';
export { FormAnswers } from '../../imports/database/formAnswers/index';
export { SynthesisQuestions } from '../../imports/database/synthesisQuestions/index';
export { SynthesisAnswers } from '../../imports/database/synthesisAnswers/index';


//multimedia
export { ImageSearch, Book, Video } from '../../imports/database/multimediaObjects'
