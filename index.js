
const { check } = require("./downloader");
const { runClient } = require("./runner");

(async () => {
    await check(false);
    await runClient();
})();