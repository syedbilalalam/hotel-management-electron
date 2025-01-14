function sel(id) {
    return document.getElementById(id);
}

// Setting button events
const actionButtons = document.getElementsByClassName('action-event');
for (let i = 0; i < actionButtons.length; i++) {
    actionButtons[i].onclick = () => {
        window.location.replace(actionButtons[i].dataset.action);
    }
}

// Exit event for the app
sel('exit').onclick = async () => {
    if (confirm('All the booking will be reset ?'))
        await window.electronAPI.runCommand(JSON.stringify({ exit: true }));
}