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

  // Save to clipboard
  await navigator.clipboard.writeText(links);
}

// Open tabs from copied links
async function openTabsFromCopiedLinks() {
  var links = await getLinksFromClipboard();

  if(links.length == 0) {
    // Exit early if no links in clipboard
    console.warn("No links found in clipboard.");
    return;
  }

  links.forEach(link => {
    // If link doesn't start with http(s) log warning and skip
    if(!link.startsWith("http")) {
      console.warn("Invalid link: ", link);
      return;
    }

    // Open link in new tab
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

  var matches = text.matchAll(urlMatchingPattern);
  
  return Array.from(matches).map(match => {
    if(match[0].startsWith("www.")) {
      return "https://" + match[0];
    } else {
      return match[0];
    }
  });
}

// Create context menu
const copyAllLinksId = "copy-all-tabs";
browser.contextMenus.create({
  id: copyAllLinksId,
  title: "Copy all tabs",
  contexts: ["tab"],
});
const copyFromStartToTargetTabId = "copy-to-target-tab";
browser.contextMenus.create({
  id: copyFromStartToTargetTabId,
  title: "Copy up to target tab",
  contexts: ["tab"],
});
const copyFromTargetTabToEndId = "copy-from-target-tab";
browser.contextMenus.create({
  id: copyFromTargetTabToEndId,
  title: "Copy from target tab",
  contexts: ["tab"],
});
const openTabsFromCopiedLinksId = "open-tabs-from-copied-links";
browser.contextMenus.create({
  id: openTabsFromCopiedLinksId,
  title: "Open tabs from copied links",
  contexts: ["tab"],
});
// browser.menus.create({
//   id: openTabsFromCopiedLinksId,
//   title: "Open tabs from copied links",
//   contexts: ["tools_menu"],
// });

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