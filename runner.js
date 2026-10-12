const config = require("./config.json");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");

const binary = config.rosemary.binary;
let prefix = config.rosemary.prefix;

function checkOptions() {
    if (binary == null || binary === "") {
        console.error("Rosemary binary cannot be blank, please specifiy one");
        return 1;
    }

    if (prefix == null || prefix === "") {
        prefix = `${os.homedir()}/.local/share/rosemary/prefixes/default`;
    }

    if (prefix.includes("~")) {
        prefix = prefix.replace("~", os.homedir());
    }

    return 0;
}

async function updatePrefix() {
    if (checkOptions() != 0) return 1;

    if (!fs.existsSync(`${prefix}/root`)) {
        console.log("Prefix path does not exist, creating a new one");
        await exec(`${binary} prefix create "${prefix}"`);
    } else {
        console.log("Updating prefix");
        await exec(`${binary} prefix update "${prefix}"`)
    }
}

async function runClient(uri) {
    if (checkOptions() != 0) return 1;
    await updatePrefix();

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