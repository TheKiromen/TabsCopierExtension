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

// Copy from start up to selected tab
async function copyToActiveTab(params) {
  // Get active tab index
  const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
  await navigator.clipboard.writeText(JSON.stringify(activeTab));
}

// Copy from selected tab up to the end
async function copyFromActiveTab(params) {
  // Get active tab index
  const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
  await navigator.clipboard.writeText(JSON.stringify(activeTab));
}

// Create context menu
const copyAllLinksId = "copy-all-tabs";
browser.contextMenus.create({
  id: copyAllLinksId,
  title: "Copy all tabs",
  contexts: ["tab"],
});
const copyFromSelectedToActiveTabId = "copy-to-active-tab";
browser.contextMenus.create({
  id: copyFromSelectedToActiveTabId,
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
      copyAllTabs();
      break;
    case copyFromSelectedToActiveTabId:
      copyToActiveTab(tab);
      break;
    case copyFromIndexToSelectedTabId:
      copyFromActiveTab(tab);
      break;
  }
})