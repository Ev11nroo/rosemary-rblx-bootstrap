const fs = require("fs");
let consts = {};

try {
    consts = require("./consts.json");
} catch {
    conts = {
        "version": "",
        "studioVersion": "",
    }
}

const { Readable } = require("stream");
const { finished } = require("stream/promises");
const { execSync } = require("child_process");

const unzipper = require("unzipper");

const expectedPlayerPath = `${__dirname}/client/RobloxPlayer.app`;
const expectedPlayerZipPath = `${__dirname}/client/RobloxPlayer.zip`;

const expectedStudioPath = `${__dirname}/client/RobloxStudio.app`;
const expectedStudioZipPath = `${__dirname}/client/RobloxStudioApp.zip`;

let downloadStudio = false;

// get version from https://clientsettingscdn.roblox.com/v2/client-version/MacPlayer
// then download compressed from https://setup.rbxcdn.com/mac/<version>-RobloxPlayer.zip

async function getVersionHash() {
    let request = null;

    if (downloadStudio) {
        request = await fetch("https://clientsettingscdn.roblox.com/v2/client-version/MacStudio");
    } else {
        request = await fetch("https://clientsettingscdn.roblox.com/v2/client-version/MacPlayer");
    }

    const data = await request.json();

    return data.clientVersionUpload;
}

async function downloadAndUnzip(hash) {
    let appPath, zipPath, url = "";

    if (downloadStudio) {
        appPath = expectedStudioPath;
        zipPath = expectedStudioZipPath;
        url = `https://setup.rbxcdn.com/mac/${hash}-RobloxStudioApp.zip`;
    } else {
        appPath = expectedPlayerPath;
        zipPath = expectedPlayerZipPath;
        url = `https://setup.rbxcdn.com/mac/${hash}-RobloxPlayer.zip`;
    }

    // download compressed client
    const request = await fetch(url);

    if (!fs.existsSync(`${__dirname}/client`)) fs.mkdirSync(`${__dirname}/client`);
    if (fs.existsSync(appPath)) fs.rmSync(appPath, { recursive: true, force: true }); // this will delete someones computer

    const stream = fs.createWriteStream(zipPath);
    await finished(Readable.fromWeb(request.body).pipe(stream));

    // unzip compressed client and delete zip
    console.log(`Decompressing Roblox ${downloadStudio ? "Studio" : "Player"}`)
    const file = await unzipper.Open.file(zipPath);
    await file.extract({ path: `${__dirname}/client/` });

    fs.rmSync(zipPath);

    // bandaid fix: make everything executable
    await execSync(`chmod -R +x ${appPath}`);

    console.log("Installation finished");
}

async function check(shouldDoStudio) {
    downloadStudio = (shouldDoStudio == true) ? true : false;

    let doDownload = false;
    const hash = await getVersionHash();
    
    if (downloadStudio && (consts.studioVersion != hash || !fs.existsSync(expectedStudioPath))) {
        consts.studioVersion = hash;
        doDownload = true;
    } else if (!downloadStudio && (consts.version != hash || !fs.existsSync(expectedPlayerPath))) {
        consts.version = hash;
        doDownload = true;
    }

    if (doDownload) {
        console.log(`Downloading Roblox ${downloadStudio ? "Studio" : "Player"}`)
        fs.writeFileSync(`${__dirname}/consts.json`, JSON.stringify(consts, null, 4), (error) => { if (error) console.error(error) });
        await downloadAndUnzip(hash);
    }
}

check(true)

module.exports = {
    check,
}