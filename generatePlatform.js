const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const pythonScript = "create_markdown.py";
const tmpFilePath = path.join(__dirname, "tmp_json.json");
const URL = "https://platform.simplicite.io/versions.json"
const jsonPath = "./formatted_versions.json"

let FROM_PLATFORM = false;

if (FROM_PLATFORM) {
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
}
else
{
    try {
        // Read from the local JSON file instead of fetching from URL
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // Write to temporary file for Python script to use
        fs.writeFileSync(tmpFilePath, JSON.stringify(data));
        
        // Execute Python script
        exec(`python3 ${pythonScript} "${tmpFilePath}"`,
            (err, stdout, stderr) => {
                // Empty the tmp file
                fs.writeFileSync(tmpFilePath, "");
                
                if (err) {
                    console.error(`Error executing script:\n${err.message}\n`);
                    return;
                }
                if (stderr) {
                    console.error(`Script error output:\n${stderr}\n`);
                    return;
                }
                console.log(`Generated "docs/resources/" from ${jsonPath}. ${stdout}`);
            }
        );
    } catch (error) {
        console.error(`\nError reading or parsing JSON from "${jsonPath}":\n`, error, "\n");
    }
}