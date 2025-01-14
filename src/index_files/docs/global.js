function sel(id) {
    return document.getElementById(id);
}
// Comuination language
function splitString(input) {
    const regex = /'((?:\\'|[^'])*)'|(\S+)/g; // Matches quoted sections or unquoted words
    const result = [];
    let match;

    while ((match = regex.exec(input)) !== null) {
        if (match[1] !== undefined) {
            // Handle quoted part: decode escaped quotes
            result.push(match[1].replace(/\\'/g, "'"));
        } else {
            // Handle unquoted word
            result.push(match[2]);
        }
    }

    return result;
}



function escapeSingleQuotes(input) {
    return input.replace(/'/g, "\\'");
}

// Setting Back button event
sel('back').onclick = () => {
    window.location.replace('../index.html');
}