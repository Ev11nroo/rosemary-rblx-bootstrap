const config = require("./config.json");
const { exec } = require("child_process");

const binary = config.rosemary.binary;
let prefix = config.rosemary.prefix;

function checkOptions() {
    if (binary == null || binary === "") {
        console.error("Rosemary binary cannot be blank, please specifiy one");
        return 1;
    }

    if (prefix == null || prefix === "") {
        prefix = "~/.local/share/rosemary/prefixes/default";
    }

    return 0;
}

async function runClient(uri) {
    if (checkOptions() != 0) return 1;

    let command = `ROSEMARY_PREFIX=${prefix} ${binary} ${__dirname}/client/RobloxPlayer.app`;

    if (uri != null || uri != undefined) {
        command += ` "${uri}"`;
    }

    console.log("Launching Roblox")
    await exec(command);
}

module.exports = {
    runClient,
}