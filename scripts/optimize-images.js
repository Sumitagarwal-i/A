const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is installed
try {
  require('sharp');
} catch (error) {
  console.log('Installing sharp for image optimization...');
  execSync('npm install sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');

function optimizeImages() {
  const files = fs.readdirSync(publicDir);
  
  files.forEach(file => {
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const inputPath = path.join(publicDir, file);
      const outputPath = path.join(publicDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      
      console.log(`Converting ${file} to WebP...`);
      
      sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
          console.log(`✅ Created ${path.basename(outputPath)}`);
        })
        .catch(err => {
          console.error(`❌ Error converting ${file}:`, err);
        });
    }
  });
}

// Run optimization
console.log('🖼️  Starting image optimization...');
optimizeImages();
console.log('✨ Image optimization complete!'); 