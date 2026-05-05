const fs = require("fs");
const path = require("path");

const paths = [".next", "dist"];

paths.forEach((p) => {
  const fullPath = path.join(process.cwd(), p);
  if (fs.existsSync(fullPath)) {
    console.log(`Removing ${p}`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

console.log("Build folders reset. Ready for fresh build.");
