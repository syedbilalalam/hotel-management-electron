sel('roomNumber').focus();
const cancelBookingFn = async (e) => {
    sel('cancelBookingForm').onsubmit = async (f) => {
        f.preventDefault();
    }
    e.preventDefault();
    sel('roomNumber').focus();

    const roomNo = parseInt(escapeSingleQuotes(sel('roomNumber').value).trim());

    // CPP comunication
    try {
        await window.electronAPI.runCommand(JSON.stringify({ msg: '3' }));
        const finalReply = await window.electronAPI.runCommand(JSON.stringify({ msg: roomNo }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: "processed" }));

        // Managing the data
        if (finalReply == "success") {
            window.electronAPI.alertBox(JSON.stringify({ type: 'info', title: 'Success', msg: 'Booking canceled!' }));
            window.location.replace('../index.html');
        }
        else if (finalReply == 'not-found') {
            window.electronAPI.alertBox(JSON.stringify({ type: 'warning', title: 'Input Error', msg: 'Booking not found!' }));
            sel('cancelBookingForm').onsubmit = cancelBookingFn;
        }
        else
            throw new Error(finalReply);

    } catch {
        // Force exit
        await window.electronAPI.alertBox(JSON.stringify({ type: 'error', title: 'Input Error', msg: 'Program crashed! C++ stopped responding please restart the program.' }));
        await window.electronAPI.runCommand(JSON.stringify({ exit: true }));
    }
}
sel('cancelBookingForm').onsubmit = cancelBookingFn;
