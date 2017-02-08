var blockId, blockName;
var blockIdList = [];
var blockObjectList = {};

function filter() {
    var postList = document.querySelectorAll('[data-hovercard]');
    for (var i = 0; i < postList.length; i++) {
        var href = postList[i].getAttribute('data-hovercard');
        for (var j = 0; j < blockIdList.length; j++) {
            if (href.substr(28, blockIdList[j].length) == blockIdList[j]) {
                if (blockObjectList[blockIdList[j]].blocked)
                    blockObjectList[blockIdList[j]].blocked += 1;
                else
                    blockObjectList[blockIdList[j]].blocked = 1;
                if (blockObjectList[blockIdList[j]].blocked > blockObjectList[blockIdList[j]].count) {
                    var wrapper = postList[i].closest("div.userContentWrapper");
                    if (wrapper) {
                        var blockDiv = wrapper.parentElement.parentElement;
                        var parentBlock = blockDiv.parentElement;
                        if (parentBlock) {
                            parentBlock.removeChild(blockDiv);
                        }
                        parentBlock = undefined;
                        blockDiv = undefined;
                    }
                    wrapper = undefined;
                }
            }
        }
        href = undefined;
    }
    postList = undefined;
}

function getBlockList() {
    chrome.storage.sync.get(null, function (result) {
        blockObjectList = result;
        blockIdList = Object.keys(result);
        filter();
    });
}
getBlockList();

function getIdFromHovercart(hovercartAttr) {
    if (hovercartAttr) {
        blockId = hovercartAttr.substr(hovercartAttr.indexOf('id=') + 3);
        var pos = blockId.indexOf('&');
        blockId = blockId.substr(0, (pos > 0) ? pos : 32);
    }
    else {
        blockId = undefined;
        blockName = undefined;
    }
}

var target = document;
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type == 'childList')
            filter();
    });
});
var config = {attributes: true, childList: true, characterData: true, subtree: true};
observer.observe(target, config);

document.addEventListener('contextmenu', function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var hovercartAttr = target.getAttribute('data-hovercard');
    if (!hovercartAttr) {
        target = target.parentElement;
        hovercartAttr = target.getAttribute('data-hovercard');
    }
    blockName = target.textContent;
    getIdFromHovercart(hovercartAttr);
}, false);

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (request.clicked === true) {
        sendResponse({status: 'Request received'});
        if (blockId) {
            var savedObj = {};
            savedObj[blockId] = {name: blockName, count: 0};
            chrome.storage.sync.set(savedObj, function () {
                getBlockList();
                console.log('Blocked ID value is saved');
            });
        }
        else {
            console.log('Blocked ID is undefined');
        }
    }
    else
        sendResponse({status: 'Request received with error'});
});
