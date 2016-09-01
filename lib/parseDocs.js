parseHtmlTags = function(text) {
  var element = document.getElementById('txt');
  // innerText for IE, textContent for other browsers
  var text = element.textContent || element.innerText || "";
  element.innerHTML = text;
}