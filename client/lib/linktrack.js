import './configs.js';

// dgacitua: Save URL and Title of current browsed page
savePage = function() {
  if (TRACKING_GLOBAL && TRACKING_LINKS) {
    var current_url = window.location.href;  //(window.content.document.location);
    var current_title = encodeURIComponent(document.title);

    var json = {
      title: current_title,
      url: current_url,
      local_time: getTimestamp()
    };

    //post_json_request(backendUrl, '/visited_links', json);
    logToConsole('Page Saved!');
  }
};

// dgacitua: Save text passed as parameter as a snippet
saveSnippet = function(current_snippet) {
  var snippet = window.getSelection().toString();

  if (TRACKING_GLOBAL && TRACKING_SNIPPETS && !isEmpty(snippet)) {
    var current_url = window.location.href;  //(window.content.document.location);
    var current_title = encodeURIComponent(document.title);

    var json = {
      title: current_title,
      url: current_url,
      snipped_text: snippet,
      local_time: getTimestamp()
    };

    //post_json_request(backendUrl, '/snippets', json);
    return json;
  }
  else {
    return null;
  }
}