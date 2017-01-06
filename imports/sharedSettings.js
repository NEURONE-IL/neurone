const availableLocales = [
  'en',
  'es',
  'fi'
];

const availableTasks = [
  'pilot',
  'pre',
  'post'
];

const availableTopics = [
  'pilot',
  'science',
  'social'
];

const availableStages = [
  //{ id: 'stagePre0', time: 5, home: '/stagepre0' },
  { id: 'stage0', time: 5, home: '/stage0' },
  { id: 'stage1', time: 10, home: '/search' },
  { id: 'stage2', time: 20, home: '/stage2' },
  { id: 'stage3', time: 10, home: '/stage3' }
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
  stages: availableStages,    //availableStages.map(a => Object.assign({}, a)),   // http://stackoverflow.com/a/40283265
  maxGlobalTime: -1,
  // Legacy configs
  snippetsPerPage: 3,
  snippetLength: 15
};