// Copy links from all open tabs in the current window
async function copyAllTabs(params) {
  // Get all tabs
  const tabs = await browser.tabs.query({ currentWindow: true });

  // Extract links from tabs
  let tabsLinks = [];
  for (const tab of tabs) {
    if (tab.url) {
      tabsLinks.push(tab.url);
    }
  }

  // TODO: Try to keep list in the same order as tabs in browser
  // Format links
  let linksString = "";
  tabsLinks.forEach((link) => {
    linksString += link + "\n";
  })

  // Save to clipboard
  await navigator.clipboard.writeText(linksString);
}

// Copy start up to selected tab
async function copyToActiveTab(params) {
  // Get active tab index
  const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
}

// Copy from selected tab up to the end
async function copyFromActiveTab(params) {
  // Get active tab index
  const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
}

// Create context menu
const copyAllLinksId = "copy-all-tabs";
browser.contextMenus.create({
  id: copyAllLinksId,
  title: "Copy all tabs",
  contexts: ["tab"],
});
const setStartingTabindexId = "copy-to-active-tab";
browser.contextMenus.create({
  id: setStartingTabindexId,
  title: "Copy up to active tab",
  contexts: ["tab"],
});
const copyFromIndexToSelectedTabId = "copy-from-active-tab";
browser.contextMenus.create({
  id: copyFromIndexToSelectedTabId,
  title: "Copy from active tab",
  contexts: ["tab"],
});

// Setup listeners
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case copyAllLinksId:
      copyAllTabs(tab);
      break;
    case setStartingTabindexId:
      copyToActiveTab(tab);
      break;
    case copyFromIndexToSelectedTabId:
      copyFromActiveTab(tab);
      break;
  }
})