let index = 0;

async function copyAllLinks(params) {
  const json = JSON.stringify(params);
  await navigator.clipboard.writeText(json);
}

async function setStartingTabindex(params) {
  index++;
  browser.contextMenus.update(copyFromIndexToSelectedTabId, {enabled: true});
}

async function copyFromIndexToSelectedTab(params) {
  await navigator.clipboard.writeText("Test value " + index);
}

// Create context menu
const copyAllLinksId = "copy-all-links";
browser.contextMenus.create({
  id: copyAllLinksId,
  title: "Copy links from all open tabs",
  contexts: ["tab"],
});
const setStartingTabindexId = "set-starting-tab-index";
browser.contextMenus.create({
  id: setStartingTabindexId,
  title: "Copy from selected tab",
  contexts: ["tab"],
});
const copyFromIndexToSelectedTabId = "copy-from-index-to-selected-tab";
browser.contextMenus.create({
  id: copyFromIndexToSelectedTabId,
  title: "Copy to selected tab",
  contexts: ["tab"],
  enabled: false,
});

// Setup listeners
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case copyAllLinksId:
      copyAllLinks(tab);
      break;
    case setStartingTabindexId:
      setStartingTabindex(tab);
      break;
    case copyFromIndexToSelectedTabId:
      copyFromIndexToSelectedTab(tab);
      break;
  }
})