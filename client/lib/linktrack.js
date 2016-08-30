import './configs.js';

// dgacitua: Test for saving snippets
getSnippet = function() {
  var snippet = window.getSelection().toString();
  saveSnippet(snippet);
};

// dgacitua: Save URL and Title of current browsed page
savePage = function() {
  if (TRACKING_GLOBAL && TRACKING_LINKS) {
    var current_url = window.location.href;  //(window.content.document.location);
    var current_title = encodeURIComponent(document.title);

    var json = {
      title: current_title,
      url: current_url,
      local_time: (new Date()).toJSON()
    };

    //post_json_request(backendUrl, '/visited_links', json);
    logToConsole('Page Saved!');
  }
};

// dgacitua: Save text passed as parameter as a snippet
saveSnippet = function(current_snippet) {
  if (TRACKING_GLOBAL && TRACKING_SNIPPETS && !isEmpty(current_snippet)) {
    var current_url = window.location.href;  //(window.content.document.location);
    var current_title = encodeURIComponent(document.title);

    var json = {
      title: current_title,
      url: current_url,
      snipped_text: current_snippet,
      local_time: (new Date()).toJSON()
    };

    //post_json_request(backendUrl, '/snippets', json);

    var message = 'Your current snippet has been saved!';
    alert(message);
    logToConsole('Snippet Saved! ' + current_snippet);
  }
}