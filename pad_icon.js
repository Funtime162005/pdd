const Jimp = require('jimp');

async function padIcon() {
  const imagePath = 'assets/images/langsphere_logo.png';
  console.log('Reading image...');
  const image = await Jimp.read(imagePath);
  
  const originalWidth = image.bitmap.width;
  const originalHeight = image.bitmap.height;
  
  // Create a new blank white image
  console.log('Creating padded background...');
  const padded = new Jimp(originalWidth, originalHeight, 0xFFFFFFFF); // White background
  
  // Resize original image to 65% of its size
  console.log('Resizing original logo to fit safe zone...');
  const newWidth = Math.floor(originalWidth * 0.65);
  const newHeight = Math.floor(originalHeight * 0.65);
  image.resize(newWidth, newHeight);
  
  // Composite the smaller logo onto the center of the white background
  console.log('Compositing images...');
  const x = Math.floor((originalWidth - newWidth) / 2);
  const y = Math.floor((originalHeight - newHeight) / 2);
  padded.composite(image, x, y);
  
  console.log('Saving padded image...');
  await padded.writeAsync('assets/images/langsphere_logo_padded.png');
  console.log('Done!');
}

padIcon().catch(console.error);
