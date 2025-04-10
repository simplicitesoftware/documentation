const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const pythonScript = "create_markdown.py";
const tmpFilePath = path.join(__dirname, "tmp_json.json");
const URL = "https://platform.simplicite.io/versions.json"

fetch(URL)
    .then(response => response.json())
    .then(data => {
        fs.writeFileSync(tmpFilePath, JSON.stringify(data));
        exec(`python3 ${pythonScript} "${tmpFilePath}"`,
            (err, stdout, stderr) => {
                // empty the tmp file
                fs.writeFileSync(tmpFilePath, "");
                if (err)
                {
                    console.error(`Error executing script:\n${err.message}\n`);
                    return;
                }
                if (stderr)
                {
                    console.error(`Script error output:\n${stderr}\n`);
                    return;
                }
                console.log(`Generated "docs/resources/" from versions.json. ${stdout}`);
            }
        );
    })
    .catch(error => console.error(`\nError fetching json at "${URL}":\n`, error, "\n"));