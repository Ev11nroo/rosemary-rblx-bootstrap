const fs = require("fs");

function trimCookie(cookie) {
    const regex = new RegExp("\.ROBLOSECURITY.*?;");

    cookie = cookie.match(regex)[0];

    return cookie;
}

function getAuthTicketFromUri(uri) {
    const regex = new RegExp("gameinfo:.*?(?=\\+)");

    uri = uri.match(regex)[0];
    uri = uri.replace("gameinfo:", "");

    return uri;
}

async function getCookieFromUri(uri) {
    if (uri == null) return 0;

    const authTicket = getAuthTicketFromUri(uri);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "referer": "https://www.roblox.com/",
            "RBXAuthenticationNegotiation": 1,
        },
        body: JSON.stringify({
            authenticationTicket: `${authTicket}`
        })
    };

    const request = await fetch("https://auth.roblox.com/v1/authentication-ticket/redeem", options);
}