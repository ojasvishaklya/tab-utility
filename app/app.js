var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

var doc = new jsPDF();
var list = document.getElementById('tab-list');
var downloadButton = document.getElementById('download-button');
var sortButton = document.getElementById('sort-button');
var checkbox = document.getElementById('checkbox');

var line = 10;
var maxLength = 80;
var fontSize = 10;
var maxLinesInOnePage = 270;

doc.setFont("courier");
doc.setFontType("normal");
doc.setFontSize(fontSize);
doc.setTextColor(0, 102, 204);



function byAlphabeticalURLOrder(tab1, tab2) {
  if (tab1.url < tab2.url) {
    return -1;
  } else if (tab1.url > tab2.url) {
    return 1;
  }
  return 0;
}

function addToHTML(url){
  var entry = document.createElement('p');
  entry.appendChild(document.createTextNode(url));    
  list.appendChild(entry);
}
function addToPDF(url){
  url=setLength(url);
  doc.text(10, line, url);
  line+=10;
  if(line>=maxLinesInOnePage){
    line = 10;
    doc.addPage();
  }
}
function setLength (url) {
  return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
}
function getTabs(tabconfig){
  chrome.tabs.query(tabconfig, (tabs) => {
    for (let i = 0; i < tabs.length; i++) {
      // addToHTML(tabs[i].title);
      addToPDF(tabs[i].url,line);
    }
    doc.save(today + '.pdf');
  });
}
function sortTabs(tabconfig){
  chrome.tabs.query(tabconfig, (tabs) => {
    tabs.sort(byAlphabeticalURLOrder);
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.move(tabs[i].id, {index: i});
    }
  });
}

downloadButton.addEventListener("click", function() {

  if(checkbox.checked){
    getTabs({});
  }else{
    getTabs({windowId: chrome.windows.WINDOW_ID_CURRENT});
  }
}, false);

sortButton.addEventListener("click", function() {

  if(checkbox.checked){
    sortTabs({});
  }else{
    sortTabs({windowId: chrome.windows.WINDOW_ID_CURRENT});
  }
}, false);