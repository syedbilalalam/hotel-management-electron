function getNameAndDateFromUrl() {
    // Get the current URL
    const url = new URL(window.location.href);

    // Use URLSearchParams to parse query parameters
    const params = new URLSearchParams(url.search);

    // Get the 'name' and 'date' values
    const roomNumber = params.get('roomnumber');
    const date = params.get('date');

    return { roomNumber, date };
}
(async () => {

    const raw = getNameAndDateFromUrl();
    const roomNo = parseInt(escapeSingleQuotes(raw.roomNumber).trim());
    const date = escapeSingleQuotes(raw.date).trim();

    // CPP comunication
    try {
        await window.electronAPI.runCommand(JSON.stringify({ msg: '6' }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: roomNo }));
        const finalReply = await window.electronAPI.runCommand(JSON.stringify({ msg: date }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: "processed" }));

        // Managing the data
        if (finalReply == 'not-found') {
            window.electronAPI.alertBox(JSON.stringify({ type: 'warning', title: 'Input Error', msg: 'No one checked in to this room number yet !' }));
            window.location.replace('../index.html');
        }

        // Managing the data
        const dat = splitString(finalReply);
        if (!dat)
            throw new Error();

        const recordsHolder = sel('sc');
        recordsHolder.innerHTML += `
             <h2>Guest Name: ${dat[0]}</h2>
                <p><strong>Room Number:</strong> ${dat[1]}</p>
                <p><strong>Stay Duration:</strong> ${dat[2]} day(s)</p>
                <p><strong>Total Cost:</strong> Rs ${dat[3]}</p>
                <p><strong>Check-In Date:</strong> ${dat[4]}</p>
                <p><strong>Status:</strong> Checked Out</p>
            `



    } catch {
        // Force exit
        await window.electronAPI.alertBox(JSON.stringify({ type: 'error', title: 'Input Error', msg: 'Program crashed! C++ stopped responding please restart the program.' }));
        await window.electronAPI.runCommand(JSON.stringify({ exit: true }));
    }
})();

sel('confirmButton').onclick = () => {
    window.location.replace('../index.html');
}