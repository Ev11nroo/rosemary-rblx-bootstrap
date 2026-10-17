const _config = require("./config.json");
const { check } = require("./downloader");
const { runClient } = require("./runner");
const { getCookieFromUriAndSave, recreateUri } = require("./cookie");

let uri = "";
let updateOnly = false;
let shouldDoStudio = false;

switch (process.argv[2]) {
    case "update-player":
        updateOnly = true;
        shouldDoStudio = false;
        break;
    case "update-studio":
        updateOnly = true;
        shouldDoStudio = true;
        break;

    case "studio":
        shouldDoStudio = true;
        break;
    case "player":
    default:
        shouldDoStudio = false;
        break;
}

if (process.argv[3] != null) {
    uri = process.argv[3];
}

(async () => {
    if (uri !== "") {
        await getCookieFromUriAndSave(uri);
        uri = await recreateUri(uri);
    }
    
    await check(shouldDoStudio);
    if (!updateOnly) await runClient(uri, shouldDoStudio);
})();