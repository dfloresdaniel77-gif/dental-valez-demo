const Jimp = require("jimp");
const path = require("path");

async function removeBackground(inputFile, outputFile) {
  try {
    const image = await Jimp.read(inputFile);
    
    // We want to remove all pixels that are very close to white.
    // The AI background is usually #f8f8f8, #f5f5f5, or pure white.
    // A threshold of 240+ for RGB usually works well for these clean white backgrounds.
    const threshold = 235;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is very bright and somewhat grey/white
      if (red > threshold && green > threshold && blue > threshold) {
        // Set alpha to 0 (transparent)
        this.bitmap.data[idx + 3] = 0;
      }
    });

    await image.writeAsync(outputFile);
    console.log(`Processed ${outputFile}`);
  } catch (error) {
    console.error(`Error processing ${inputFile}:`, error);
  }
}

async function main() {
  const tools = ["tool_mirror", "tool_scaler", "tool_probe", "tool_syringe", "tool_forceps"];
  for (const tool of tools) {
    const inputPath = path.join(__dirname, "public", "images", `${tool}.png`);
    const outputPath = path.join(__dirname, "public", "images", `${tool}_nobg.png`);
    await removeBackground(inputPath, outputPath);
  }
}

main();
