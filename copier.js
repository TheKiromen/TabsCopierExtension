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
async function copyRelativeToTargetTab(tab, copyFromStart) {
  // TODO: Refactor to have matching based on param, pass some comparator function?

  // Get target tab index
  const targetTab = tab.index;

  // Get all tabs for current window
  const tabs = await browser.tabs.query({ currentWindow: true });

  // Save links matching target index
  let links = "";
  if(copyFromStart){
    tabs.forEach(tab => {
      if(tab.index <= targetTab) {
        links += tab.url + "\n";
      }
    });
  }
  else{
    tabs.forEach(tab => {
      if(tab.index >= targetTab) {
        links += tab.url + "\n";
      }
    });
  }

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
const copyFromStartToTargetTabId = "copy-to-target-tab";
browser.contextMenus.create({
  id: copyFromStartToTargetTabId,
  title: "Copy up to active tab",
  contexts: ["tab"],
});
const copyFromTargetTabToEndId = "copy-from-target-tab";
browser.contextMenus.create({
  id: copyFromTargetTabToEndId,
  title: "Copy from active tab",
  contexts: ["tab"],
});

// Setup listeners
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case copyAllLinksId:
      copyAllTabs();
      break;
    case copyFromStartToTargetTabId:
      copyRelativeToTargetTab(tab, true);
      break;
    case copyFromTargetTabToEndId:
      copyRelativeToTargetTab(tab, false);
      break;
  }
})