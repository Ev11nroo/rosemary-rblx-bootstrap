let { version } = require("./consts.json");
const fs = require("fs");

// https://clientsettingscdn.roblox.com/v2/client-version/MacPlayer
// https://setup.rbxcdn.com/mac/<version>-RobloxPlayer.zip

async function getVersionHash() {
    let request = await fetch("https://clientsettingscdn.roblox.com/v2/client-version/MacPlayer");
    const data = await request.json();

    return data.clientVersionUpload;
}

async function check() {
    const hash = await getVersionHash();
}