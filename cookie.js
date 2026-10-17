const fs = require("fs");

function getAuthTicketFromUri(uri) {
    const regex = new RegExp("gameinfo:.*?(?=\\+)");

    uri = uri.match(regex)[0];
    uri = uri.replace("gameinfo:", "");

    return uri;
}

async function getCookieFromUri(uri) {
    const authTicket = getAuthTicketFromUri(uri);
}