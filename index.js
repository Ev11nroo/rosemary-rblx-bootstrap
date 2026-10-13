const { check } = require("./downloader");
const { runClient } = require("./runner");

let uri = null;
let shouldDoStudio = false;

if (process.argv[2] == "client" || process.argv[2] == null) {
    shouldDoStudio = false;
    uri = process.argv[3];
    console.log("player")
} else if (process.argv[2] == "studio") {
    shouldDoStudio = true;
    uri = process.argv[3];
}

(async () => {
    await check(shouldDoStudio);
    await runClient(uri, shouldDoStudio);
})();