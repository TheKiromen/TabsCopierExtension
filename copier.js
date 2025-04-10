// Comparator functions
const isGreaterOrEqual = (a,b) => a >= b;
const isLessOrEqual = (a,b) => a <= b;


// Copy links from all open tabs in the current window
async function copyAllTabs() {
  // Get all tabs for current window
  const tabs = await browser.tabs.query({ currentWindow: true });

  // Save links separated by line break
  let links = "";
  tabs.forEach(tab => {
    links += tab.url + "\n";
  });

  // Save to clipboard
  await navigator.clipboard.writeText(links);
}

// Copy relative to target tab
async function copyRelativeToTargetTab(tab, comparator) {
  // Get target tab index
  const targetTab = tab.index;

  // Get all tabs for current window
  const tabs = await browser.tabs.query({ currentWindow: true });

  // Save links matching target index
  let links = "";
  tabs.forEach(tab => {
    if(comparator(tab.index, targetTab)) {
      links += tab.url + "\n";
    }
  });

  // Save to clipboard
  await navigator.clipboard.writeText(links);
}

async function openTabsFromCopiedLinks() {
  console.log("Opening tabs from copied links...");
  var links = getLinksFromClipboard();
  console.log(links);
}

function getLinksFromClipboard() {
  return navigator.clipboard.readText();
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
browser.menus.create({
  id: openTabsFromCopiedLinksId,
  title: "Open tabs from copied links",
  contexts: ["tools_menu"],
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