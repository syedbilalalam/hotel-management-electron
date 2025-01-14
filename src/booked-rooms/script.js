(async () => {
    try {
        const reply = await window.electronAPI.runCommand(JSON.stringify({ msg: '4' }));
        const recordsHolder = sel('aros');
        console.log(reply);
        if(reply == 'empty'){
            recordsHolder.innerHTML += `
            <div class="no-bookings">
                <p>No rooms are currently booked.</p>
            </div>
            `
            return;
        }

        // Managing the data to the screen
        const dat = splitString(reply);
        if (!dat)
            throw new Error();

        console.log(reply);
        for (let i = 0; i < dat.length; i += 7) {
            const isBooked = parseInt(dat[i + 2]) ? true : false;
            recordsHolder.innerHTML += `
             <div class="room-card">
                <h2>Room Number: ${dat[i]}</h2>
                <p><strong>Room Type:</strong> ${dat[i+1]}</p>
                <p><strong>Guest Name:</strong> ${dat[i+2]}</p>
                <p><strong>Phone Number:</strong> ${dat[i+3]}</p>
                <p><strong>Email:</strong> ${dat[i+4]}</p>
                <p><strong>Days Booked:</strong> ${dat[i+5]} day(s)</p>
                <p><strong>Total Cost:</strong> Rs ${dat[i+6]}</p>
            </div>
            `
            
        }

    } catch {
        // Force exit
        await window.electronAPI.alertBox(JSON.stringify({ type: 'error', title: 'Input Error', msg: 'Program crashed! C++ stopped responding please restart the program.' }));
        await window.electronAPI.runCommand(JSON.stringify({ exit: true }));
    }
})();