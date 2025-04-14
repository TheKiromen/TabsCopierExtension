const urlPattern = "((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)"

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

  // Match URLs in the text
  var sample = `
    https://www.youtube.com
    www.google.com
    www.a
    RegExr was created by gskinner.com.

    Edit the Expression & Text to see matches. Roll over matches or the expression for details. PCRE & JavaScript flavors of RegEx are supported. Validate your expression with Tests mode.

    The side bar includes a Cheatsheet, full Reference, and Help. You can also Save & Share with the Community and view patterns you create or favorite in My Patterns.
    https://duckduckgo.com/?t=ffab&q=regex+for+url+validation&ia=web
    https://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
    https://regexr.com/8e2i7

    Explore results with the Tools below. Replace & List output custom results. Details lists capture groups. Explain describes your expression in plain English.
    `;
  var matches = sample.match("www.+");
  console.log("Matches: ", matches);

  var links = text.split("\n").filter(link => link.length > 0);
  return [];
  return links;
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