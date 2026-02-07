const fs = require("fs");
const path = require("path");

const rootDir = "./src";

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith(".js")) {
      let content = fs.readFileSync(full, "utf8");

      const updated = content.replace(
        /import\s+\{\s*z\s*\}\s+from\s+["']zod["'];?/g,
        'const { z } = await import("zod");'
      );

      if (updated !== content) {
        fs.writeFileSync(full, updated);
        console.log("Updated:", full);
      }
    }
  });
}

walk(rootDir);

console.log("\n✅ All Zod imports fixed.");
