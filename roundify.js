const Jimp = require('jimp');

async function makeRoundFavicon() {
    try {
        // Read the image
        const image = await Jimp.read('favicon.jpg');
        
        // Ensure it's square first (crop to center)
        const size = Math.min(image.bitmap.width, image.bitmap.height);
        const x = (image.bitmap.width - size) / 2;
        const y = (image.bitmap.height - size) / 2;
        
        image.crop(x, y, size, size);
        
        // Make it circular
        image.circle();
        
        // Save as PNG to support transparency
        await image.writeAsync('favicon.png');
        console.log('Successfully created round favicon.png!');
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

makeRoundFavicon();
