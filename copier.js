// TODO: Update ID's to actual values
browser.contextMenus.create({
  id: "1",
  title: "Copy links from all open tabs",
  contexts: ["tab"],
});
browser.contextMenus.create({
  id: "2",
  title: "Copy from selected tab",
  contexts: ["tab"],
});
browser.contextMenus.create({
  id: "3",
  title: "Copy to selected tab",
  contexts: ["tab"],
  enabled: false,
});