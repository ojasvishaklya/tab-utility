// defining the variables used.
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

// setting the pdf document defaults
doc.setFont("courier");
doc.setFontType("normal");
doc.setFontSize(fontSize);
doc.setTextColor(0, 102, 204);


// to sort the urls from the tab in alphabetical order
function byAlphabeticalURLOrder(tab1, tab2) {
  if (tab1.url < tab2.url) {
    return -1;
  } else if (tab1.url > tab2.url) {
    return 1;
  }
  return 0;
}

// defining the length of the url to be added in the file. 
// if the url exceeds the maxlength, the url is trimmed to maxlength and extended with "..."
function setLength (url) {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
}

//to create a html file with the urls
function addToHTML(url){
  var entry = document.createElement('p');
  entry.appendChild(document.createTextNode(url));    
  list.appendChild(entry);
}

//to create a pdf file with the urls
function addToPDF(url){
  url=setLength(url);
  doc.text(10, line, url);
  line+=10;
  if(line>=maxLinesInOnePage){
    line = 10;
    doc.addPage();
  }
}

// to get the tabs which are opened in the session window at the time.
function getTabs(tabconfig){
  chrome.tabs.query(tabconfig, (tabs) => {
    for (let i = 0; i < tabs.length; i++) {
      // addToHTML(tabs[i].title);
      addToPDF(tabs[i].url,line);
    }
    doc.save(today + '.pdf');
  });
}

//to sort the tabs of the chrome according to the url; they are sorted alphabetically
function sortTabs(tabconfig){
  chrome.tabs.query(tabconfig, (tabs) => {
    tabs.sort(byAlphabeticalURLOrder);
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.move(tabs[i].id, {index: i});
    }
  });
}

// adding the checkbox event to get all the tabs in the chrome and add them to pdf
downloadButton.addEventListener("click", function() {
  if(checkbox.checked){
    getTabs({});
  }else{
    getTabs({windowId: chrome.windows.WINDOW_ID_CURRENT});
  }
}, false);

// adding the checkbox event to get all the tabs in the chrome and sort them alphabetically
sortButton.addEventListener("click", function() {
  if(checkbox.checked){
    sortTabs({});
  }else{
    sortTabs({windowId: chrome.windows.WINDOW_ID_CURRENT});
  }
}, false);
