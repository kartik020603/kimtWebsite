const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src');

function replaceIndigoWithBlue(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        files.forEach((file, index) => {
            const filePath = path.join(dir, file);

            fs.stat(filePath, (error, stat) => {
                if (error) {
                    console.error("Error stating file.", error);
                    return;
                }

                if (stat.isFile()) {
                    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
                        let content = fs.readFileSync(filePath, 'utf8');
                        
                        // Regex to carefully match Tailwind indigo classes
                        // Matches things like: bg-indigo-500, text-indigo-600, border-indigo-200, hover:bg-indigo-700
                        const newContent = content.replace(/([a-z:]*-)?indigo-([0-9]{2,3})/g, (match, prefix, shade) => {
                            // If it matches exactly 'indigo', replace with 'blue'.
                            if (prefix) {
                                return `${prefix}blue-${shade}`;
                            }
                            return `blue-${shade}`;
                        });

                        if (content !== newContent) {
                            fs.writeFileSync(filePath, newContent, 'utf8');
                            console.log(`Updated: ${filePath}`);
                        }
                    }
                } else if (stat.isDirectory()) {
                    replaceIndigoWithBlue(filePath);
                }
            });
        });
    });
}

console.log("Starting color replacement: indigo -> blue");
replaceIndigoWithBlue(directoryPath);
