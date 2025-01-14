(async () => {
    try {
        const reply = await window.electronAPI.runCommand(JSON.stringify({ msg: '1' }));

        // Managing the data to the screen
        const dat = splitString(reply);
        if (!dat)
            throw new Error();

        const recordsHolder = sel('aros');
        for (let i = 0; i < dat.length; i += 3) {
            const isBooked = parseInt(dat[i + 2]) ? true : false;
            recordsHolder.innerHTML += `
            <tr>
                    <td>${dat[i]}</td>
                    <td>${dat[i + 1]}</td>
                    <td class="status ${isBooked ? 'booked' : 'available'}">${isBooked ? 'Booked' : 'Available'}</td>
            </tr>
            `

        }


    } catch {
        // Force exit
        await window.electronAPI.alertBox(JSON.stringify({ type: 'error', title: 'Input Error', msg: 'Program crashed! C++ stopped responding please restart the program.' }));
        await window.electronAPI.runCommand(JSON.stringify({ exit: true }));
    }
})();