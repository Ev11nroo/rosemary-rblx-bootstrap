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

async function getCookieFromUriAndSave(uri) {
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
    const cookie = trimCookie(await request.headers.get("set-cookie"));

    let config = require("./config.json");
    config.cookie = cookie;
    fs.writeFile("./config.json", JSON.stringify(config, null, 4), (err) => { if (err) console.log(err); });

    console.log("Saved Roblox Cookie");
}

module.exports = {
    getCookieFromUriAndSave,
}