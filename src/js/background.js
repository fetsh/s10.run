chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ autoUpdate: true }, function () {
        console.log("autoUpdate is set to true");
    });
});