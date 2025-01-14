sel('room-number').focus();
const bookRoomFn = async (e) => {
    sel('bookingForm').onsubmit = async (f) => {
        f.preventDefault();
    }
    e.preventDefault();
    sel('room-number').focus();

    const roomNo = parseInt(escapeSingleQuotes(sel('room-number').value).trim());
    const guestName = escapeSingleQuotes(sel('guest-name').value).trim();
    const phone = escapeSingleQuotes(sel('phone').value).trim();
    const email = escapeSingleQuotes(sel('email').value).trim();
    const marriageStatus = escapeSingleQuotes(sel('marriage-status').value).trim();
    const days = parseInt(escapeSingleQuotes(sel('days').value).trim());

    console.log(email, guestName)
    // CPP comunication
    try {
        await window.electronAPI.runCommand(JSON.stringify({ msg: '2' }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: roomNo }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: guestName }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: phone }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: email }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: marriageStatus }));
        const finalReply = await window.electronAPI.runCommand(JSON.stringify({ msg: days }));
        await window.electronAPI.runCommand(JSON.stringify({ msg: "processed" }));

        // Managing the data
        if (finalReply == "success") {
            window.electronAPI.alertBox(JSON.stringify({ type: 'info', title: 'Success', msg: 'Successfully booked!' }));
            window.location.replace('../index.html');
        }
        else if (finalReply == 'failed') {
            window.electronAPI.alertBox(JSON.stringify({ type: 'warning', title: 'Input Error', msg: 'Room number not available!' }));
            sel('bookingForm').onsubmit = bookRoomFn
        }
        else
            throw new Error(finalReply);

    } catch {
        // Force exit
        await window.electronAPI.alertBox(JSON.stringify({ type: 'error', title: 'Input Error', msg: 'Program crashed! C++ stopped responding please restart the program.' }));
        await window.electronAPI.runCommand(JSON.stringify({ exit: true }));
    }
}
sel('bookingForm').onsubmit = bookRoomFn


const calcCostFn = async () => {
    sel('calcCost').onclick = null;
    if (!sel('days').value) {
        window.electronAPI.alertBox(JSON.stringify({ type: 'warning', title: 'Costs', msg: 'Please enter day(s) you will stay!' }));
        return;
    }

    const days = parseInt(escapeSingleQuotes(sel('days').value).trim());
    const marriageStatus = escapeSingleQuotes(sel('marriage-status').value).trim();
    if (!marriageStatus) {
        window.electronAPI.alertBox(JSON.stringify({ type: 'warning', title: 'Costs', msg: 'Please enter Marriage Status!' }));
        return;
    }


    await window.electronAPI.runCommand(JSON.stringify({ msg: '8' }));
    await window.electronAPI.runCommand(JSON.stringify({ msg: days }));
    const finalReply = await window.electronAPI.runCommand(JSON.stringify({ msg: marriageStatus }));
    await window.electronAPI.runCommand(JSON.stringify({ msg: "processed" }));

    // Managing the data
    window.electronAPI.alertBox(JSON.stringify({ type: 'info', title: 'Costs', msg: 'Total Cost: Rs ' + finalReply }));

    sel('calcCost').onclick = calcCostFn;

}
sel('calcCost').onclick = calcCostFn;