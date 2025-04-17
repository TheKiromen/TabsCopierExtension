const urlMatchingPattern = "(?:https?:\\/\\/)?(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)";

// Comparator functions
const isGreaterOrEqual = (a,b) => a >= b;
const isLessOrEqual = (a,b) => a <= b;


// Copy links from all open tabs in the current window
async function copyAllTabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });

  // Save links separated by line break
  let links = "";
  tabs.forEach(tab => {
    links += tab.url + "\n";
  });

  await navigator.clipboard.writeText(links);
}

// Copy relative to target tab
async function copyRelativeToTargetTab(tab, comparator) {
  const targetTab = tab.index;

  const tabs = await browser.tabs.query({ currentWindow: true });

  // Save links specified by target tab based on comparator
  let links = "";
  tabs.forEach(tab => {
    if(comparator(tab.index, targetTab)) {
      links += tab.url + "\n";
    }
  });

  await navigator.clipboard.writeText(links);
}

// Open tabs from copied links
async function openTabsFromCopiedLinks() {
  var links = await getLinksFromClipboard();

  // Exit early if no links in clipboard
  if(links.length == 0) {
    console.warn("No links found in clipboard.");
    return;
  }

  links.forEach(link => {
    browser.tabs.create({ 
      url: link,
      active:false
    }).catch(err => {
      console.error("Error opening tab: ", err);
    });
  });
}

async function getLinksFromClipboard() {
  var text = await navigator.clipboard.readText();

  // Add https:// to links that start with "www.", new tab only accepts fully qualified URLs
  var links = Array.from(text.matchAll(urlMatchingPattern)).map(match => {
    if(match[0].startsWith("www.")) {
      return "https://" + match[0];
    } else {
      return match[0];
    }
  });

  // Remove any invalid links
  links = links.filter(link => link.startsWith("http"));
  // If link contains "www." it should contain at least two dots, otherwise at least one dot
  links = links.filter(link => {
    var numOfDots = link.split(".").length - 1;
    if(link.includes("www.")) {
      return numOfDots >= 2;
    } else {
      return numOfDots >= 1;
    }
  });

  return links;  
}

// Create context menu
const copyAllLinksId = "copy-all-tabs";
browser.contextMenus.create({
  id: copyAllLinksId,
  title: "Copy all tabs",
  contexts: ["tab"]
});
const copyFromStartToTargetTabId = "copy-to-target-tab";
browser.contextMenus.create({
  id: copyFromStartToTargetTabId,
  title: "Copy up to target tab",
  contexts: ["tab"]
});
const copyFromTargetTabToEndId = "copy-from-target-tab";
browser.contextMenus.create({
  id: copyFromTargetTabToEndId,
  title: "Copy from target tab",
  contexts: ["tab"]
});
const openTabsFromCopiedLinksId = "open-tabs-from-copied-links";
browser.menus.create({
  id: openTabsFromCopiedLinksId,
  title: "Open tabs from copied links",
  contexts: ["tab", "link", "page"]
});

// Setup listeners
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case copyAllLinksId:
      copyAllTabs();
      break;
    case copyFromStartToTargetTabId:
      copyRelativeToTargetTab(tab, isLessOrEqual);
      break;
    case copyFromTargetTabToEndId:
      copyRelativeToTargetTab(tab, isGreaterOrEqual);
      break;
    case openTabsFromCopiedLinksId:
      openTabsFromCopiedLinks();
      break;
  }
})