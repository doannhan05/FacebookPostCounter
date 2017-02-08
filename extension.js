function generateOnClick(info, tab) {
    chrome.tabs.sendRequest(tab.id, {clicked: true}, function (response) {
        console.log(response.status);
    });
}

function openSetting() {
    window.open('options.html', '_blank');
}

chrome.contextMenus.create({
    "title": "Set counter for this account", "contexts": ["link"],
    "documentUrlPatterns": ["*://*.facebook.com/*"],
    "onclick": generateOnClick
});

chrome.contextMenus.create({
    "title": "Facebook Post Counter Setting",
    "documentUrlPatterns": ["*://*.facebook.com/*"],
    "onclick": openSetting
});
