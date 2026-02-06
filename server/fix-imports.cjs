const fs = require("fs");
const path = require("path");

const rootDir = "./src";

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Add .js to local imports without extension
  content = content.replace(
    /from\s+["'](\.{1,2}\/[^"']+?)(?<!\.js)["']/g,
    (match, p1) => `from "${p1}.js"`
  );

  fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith(".js")) {
      processFile(fullPath);
    }
  });
}

walkDir(rootDir);

console.log("✅ Done! All local imports updated.");
