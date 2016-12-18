const availableLocales = [
  'en',
  'es',
  'fi'
];

const availableTasks = [
  'pre',
  'post'
];

const availableTopics = [
  'pilot',
  'science',
  'social'
];

export default SharedSettings = {
  locale: availableLocales[0],
  task: availableTasks[0],
  topic: availableTopics[0],
  queryIdeas: 2,
  minBookmarks: 3,
  maxBookmarks: 3,
  minSnippetsPerPage: 1,
  maxSnippetsPerPage: 3,
  minSnippetWordLength: 5,
  maxSnippetWordLength: 50,
  snippetWordTruncateThreshold: 25,
  minSynthesisWordLength: 50,
  syhtesisAutosaveInterval: 30,
  stageLength: [5, 10, 20, 10],
  // Legacy configs
  snippetsPerPage: 3,
  snippetLength: 15
};