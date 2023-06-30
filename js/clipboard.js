function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        promptCopyToClipBoard(text)
    }

    document.body.removeChild(textArea);
}
async function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    return navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);

        promptCopyToClipBoard(text)
    });
}

function promptCopyToClipBoard(text) {
    window.prompt("Copy failed, let's do it manually: Ctrl+C, Enter", text);
}

window.copyTextToClipboard = copyTextToClipboard
window.promptCopyToClipBoard = promptCopyToClipBoard
window.fallbackCopyTextToClipboard = fallbackCopyTextToClipboard
