export default SharedSettings = {
  locale: 'fi',
  task: availableTasks[0],
  topics: availableTopics[0],
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
  stageLength: [5, 10, 10, 10],
  // Legacy configs
  snippetsPerPage: 3,
  snippetLength: 15
}

const availableTasks = [
  'pre',
  'post'
];

const availableTopics = [
  'pilot',
  'science',
  'social'
];