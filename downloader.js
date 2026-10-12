let consts = require("./consts.json");
const fs = require("fs");
const { Readable } = require("stream");
const { finished } = require("stream/promises");

const unzipper = require("unzipper");

// get version from https://clientsettingscdn.roblox.com/v2/client-version/MacPlayer
// then download compressed from https://setup.rbxcdn.com/mac/<version>-RobloxPlayer.zip

async function getVersionHash() {
    const request = await fetch("https://clientsettingscdn.roblox.com/v2/client-version/MacPlayer");
    const data = await request.json();

    return data.clientVersionUpload;
}

async function downloadAndUnzip(hash) {
    // download compressed client
    const request = await fetch(`https://setup.rbxcdn.com/mac/${hash}-RobloxPlayer.zip`);

    if (!fs.existsSync(`${__dirname}/client`)) fs.mkdirSync(`${__dirname}/client`);
    if (fs.existsSync(`${__dirname}/client`)) fs.rmSync(`${__dirname}/client/RobloxPlayer.app`, { recursive: true, force: true }); // this will delete someones computer

    const stream = fs.createWriteStream(`${__dirname}/client/RobloxPlayer.zip`);
    await finished(Readable.fromWeb(request.body).pipe(stream));

    // unzip compressed client and delete zip
    console.log("Decompressing Roblox client")
    const file = await unzipper.Open.file(`${__dirname}/client/RobloxPlayer.zip`);
    await file.extract({ path: `${__dirname}/client/` });

    fs.rmSync(`${__dirname}/client/RobloxPlayer.zip`);
}

async function check() {
    const hash = await getVersionHash();

    if (consts.version != hash) {
        consts.version = hash;
        fs.writeFile(`${__dirname}/consts.json`, JSON.stringify(consts, null, 4), (error) => { if (error) console.error(error) });

        console.log("Downloading Roblox client");
        downloadAndUnzip(hash);
    }
}