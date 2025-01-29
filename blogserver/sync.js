const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Define source and destination directories
const sourceDir = "/vmstorage/obsidian/vault/Blogs/";
const destinationDir = "/home/matt/website/blogserver/source/_posts/";

// Sync files using rsync
function syncFiles() {
  try {
    execSync(`rsync -av --delete --exclude='Index.md' ${sourceDir} ${destinationDir}`, { stdio: "inherit" });
    console.log("✅ Files synced successfully.");
  } catch (error) {
    console.error("❌ Error syncing files:", error.message);
  }
}

// Process Markdown files
function processFiles() {
  const files = fs.readdirSync(destinationDir).filter(file => file.endsWith(".md"));

  files.forEach(file => {
    const filePath = path.join(destinationDir, file);
    let content = fs.readFileSync(filePath, "utf8");

    // Match front matter & extract metadata
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return; // Skip if no valid front matter

    const frontMatter = match[1];
    const body = match[2];

    // Check if 'complete: No' exists in front matter
    if (frontMatter.includes("complete: No")) {
      const newContent = `---\n${frontMatter}\n---\nComing Soon!`;
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`✏️  Updated: ${file}`);
    }
  });

  console.log("✅ Processing complete.");
}

// Run both functions
syncFiles();
processFiles();
