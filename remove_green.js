const Jimp = require("jimp");
const path = require("path");

async function chromaKey(inputFile, outputFile) {
  const image = await Jimp.read(inputFile);
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Green screen detection: green channel is dominant and high
    // Also handle green spill on edges of the tool
    if (g > 100 && g > r * 1.3 && g > b * 1.3) {
      // Pure green -> fully transparent
      this.bitmap.data[idx + 3] = 0;
    } else if (g > 80 && g > r * 1.15 && g > b * 1.15) {
      // Green spill on edges -> partially transparent to anti-alias
      const greenness = (g - Math.max(r, b)) / g;
      const alpha = Math.max(0, Math.min(255, Math.round(255 * (1 - greenness * 2))));
      this.bitmap.data[idx + 3] = alpha;
      // Also de-spill: reduce green channel to match the average of r and b
      this.bitmap.data[idx + 1] = Math.round((r + b) / 2);
    }
  });

  await image.writeAsync(outputFile);
  console.log(`Done: ${outputFile}`);
}

async function main() {
  const tools = ["tool_mirror", "tool_scaler", "tool_probe", "tool_syringe", "tool_forceps"];
  for (const tool of tools) {
    const inputPath = path.join(__dirname, "public", "images", `${tool}_green.png`);
    const outputPath = path.join(__dirname, "public", "images", `${tool}_final.png`);
    await chromaKey(inputPath, outputPath);
  }
  console.log("All done!");
}

main();
