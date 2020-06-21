let autoUpdateCheckbox = document.getElementById('autoUpdateCheckbox');

chrome.storage.sync.get('autoUpdate', function (data) {
    autoUpdateCheckbox.checked = data.autoUpdate;
});

autoUpdateCheckbox.addEventListener('click', function () {
    chrome.storage.sync.set({ autoUpdate: autoUpdateCheckbox.checked }, function () {
        console.log('autoUpdate is set to ', autoUpdateCheckbox.checked);
    })
});