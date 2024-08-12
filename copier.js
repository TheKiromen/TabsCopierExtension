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

// TODO: Refactor to have only one method with params
// Copy from start up to clicked tab
async function copyToTargetTab(tab) {
  // Get target tab index
  const targetTab = tab.index;

  // Get all tabs for current window
  const tabs = await browser.tabs.query({ currentWindow: true });

  // Save links matching target index
  let links = "";
  tabs.forEach(tab => {
    if(tab.index <= targetTab) {
      links += tab.url + "\n";
    }
  });

  // Save to clipboard
  await navigator.clipboard.writeText(links);
}

// Copy from clicked tab up to the end
async function copyFromTargetTab(tab) {
  // Get target tab index
  const targetTab = tab.index;

  // Get all tabs for current window
  const tabs = await browser.tabs.query({ currentWindow: true });

  // Save links matching target index
  let links = "";
  tabs.forEach(tab => {
    if(tab.index >= targetTab) {
      links += tab.url + "\n";
    }
  });

  // Save to clipboard
  await navigator.clipboard.writeText(links);
}

// Create context menu
const copyAllLinksId = "copy-all-tabs";
browser.contextMenus.create({
  id: copyAllLinksId,
  title: "Copy all tabs",
  contexts: ["tab"],
});
const copyFromSelectedToActiveTabId = "copy-to-target-tab";
browser.contextMenus.create({
  id: copyFromSelectedToActiveTabId,
  title: "Copy up to active tab",
  contexts: ["tab"],
});
const copyFromIndexToSelectedTabId = "copy-from-target-tab";
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
      copyToTargetTab(tab);
      break;
    case copyFromIndexToSelectedTabId:
      copyFromTargetTab(tab);
      break;
  }
})