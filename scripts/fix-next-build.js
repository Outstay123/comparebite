const fs = require("fs");
const path = require("path");

const paths = [".next", "dist"];

paths.forEach((p) => {
  const fullPath = path.join(process.cwd(), p);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✓ Removed ${p}`);
    } catch (err) {
      console.error(`✗ Failed to remove ${p}:`, err.message);
    }
  } else {
    console.log(`○ ${p} not found (already clean)`);
  }
});

// Also clean any tmp files that might be lingering
const nextDir = path.join(process.cwd(), ".next");
if (fs.existsSync(nextDir)) {
  try {
    const files = fs.readdirSync(nextDir, { recursive: true });
    let tmpCount = 0;
    files.forEach((file) => {
      if (file.includes('.tmp')) {
        const tmpPath = path.join(nextDir, file);
        try {
          fs.unlinkSync(tmpPath);
          tmpCount++;
        } catch (e) {
          // ignore
        }
      }
    });
    if (tmpCount > 0) {
      console.log(`✓ Cleaned ${tmpCount} temporary files`);
    }
  } catch (e) {
    // ignore
  }
}

console.log("\n✅ Build folders reset. Ready for fresh start.");
