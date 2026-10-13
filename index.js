const { check } = require("./downloader");
const { runClient } = require("./runner");

let uri = "";
let shouldDoStudio = false;

if (process.argv[2] == "client" || process.argv[2] == null) {
    shouldDoStudio = false;
} else if (process.argv[2] == "studio") {
    shouldDoStudio = true;
}

if (process.argv[3] != null) {
    uri = process.argv[3];
}

(async () => {
    await check(shouldDoStudio);
    await runClient(uri, shouldDoStudio);
})();