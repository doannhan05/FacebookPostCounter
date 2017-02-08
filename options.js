window.onload = function () {
    var blockIdListElem = document.getElementById('blockIdList');
    document.getElementById('deleteBtn').addEventListener('click', function () {
        chrome.storage.sync.clear(function () {
            blockIdListElem.innerHTML = '';
            alert('Storage is cleared. Refresh Facebook page to take effect.');
        });
    });
    chrome.storage.sync.get(null, function (result) {
        generateList(result);
    });

    function updateBlockList(blockId, blockName, postCount) {
        var savedObj = {};
        savedObj[blockId] = {name: blockName, count: postCount};
        chrome.storage.sync.set(savedObj);
    }

    function removeBlockId(blockId) {
        chrome.storage.sync.remove(blockId, function () {
            var removedNode = document.getElementById('row_' + blockId);
            removedNode.parentElement.removeChild(removedNode);
        });
    }

    function generateList(listObj) {
        blockIdListElem.innerHTML = '<table></table>';
        for (key in listObj) {
            var row = document.createElement("tr");
            row.setAttribute('id', 'row_' + key);

            var avatar = document.createElement("td");
            var image = document.createElement("img");
            image.setAttribute('src', 'http://graph.facebook.com/' + key + '/picture');
            avatar.appendChild(image);

            var name = document.createElement("td");
            name.textContent = listObj[key].name;

            var label = document.createElement("td");
            label.textContent = key;

            var value = document.createElement("td");
            var input = document.createElement("input");
            input.setAttribute('type', 'number');
            input.setAttribute('min', 0);
            input.setAttribute('id', key);
            input.setAttribute('name', listObj[key].name);
            input.setAttribute('value', listObj[key].count);
            input.addEventListener("input", function (e) {
                updateBlockList(e.target.getAttribute('id'), e.target.getAttribute('name'), Math.abs(parseInt(e.target.value)));
            });
            value.appendChild(input);

            var remove = document.createElement("td");
            var removeBtn = document.createElement("input");
            removeBtn.setAttribute('type', 'button');
            removeBtn.setAttribute('id', key);
            removeBtn.setAttribute('value', 'X');
            removeBtn.addEventListener("click", function (e) {
                removeBlockId(e.target.getAttribute('id'));
            });
            remove.appendChild(removeBtn);

            row.appendChild(avatar);
            row.appendChild(name);
            row.appendChild(label);
            row.appendChild(value);
            row.appendChild(remove);
            blockIdListElem.appendChild(row);
        }
    }
};