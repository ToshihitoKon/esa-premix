/// タブのページ遷移を監視するイベント
chrome.tabs.onUpdated.addListener(
  async (_, changeInfo: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
    console.log("Tab updated:", { changeInfo, tab });
    if (changeInfo.status !== "complete") {
      return;
    }

    if (!tab?.url?.includes("esa.io")) {
      return;
    }

    console.log(`Change URL: ${tab.url}`);
    try {
      await chrome.tabs.sendMessage(tab.id!, { url: tab.url });
    } catch (error) {
      console.log(`Failed to send message to content script: ${error}`);
    }
  },
);

export {};
