// via https://www.reddit.com/r/learnjavascript/comments/7sbiyh/listener_for_chrometabsonactivated_never_called/dt3vyr6/?utm_source=reddit&utm_medium=web2x&context=3
(function() {
  this.currentTabId = null;

  chrome.tabs.onUpdated.addListener(({ tabId, changeInfo, tab }) => {
    console.log('on updated', tabId)
    chrome.storage.sync.set({ previousTabId: tabId })
    chrome.storage.sync.set({ currentTabId: tabId })
  })

  // https://developer.chrome.com/docs/extensions/reference/tabs/#event-onActivated
  chrome.tabs.onActivated.addListener(({ tabId }) => {
    console.log('on activated')
    if (tabId !== this.currentTabId) {
      // set previous change for when popup re-renders
      chrome.storage.sync.set({ previousTabId: this.currentTabId })

      // set this for listening again
      this.currentTabId = tabId;

      // detect new current
      chrome.storage.sync.set({ currentTabId: tabId });
    }
  });
})();
