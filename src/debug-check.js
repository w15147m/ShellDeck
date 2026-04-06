const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

console.log('--- DEBUG CHECK START ---');
console.log('Platform:', process.platform);
console.log('Home Dir:', os.homedir());

const autostartDir = path.join(os.homedir(), '.config', 'autostart');
console.log('Target Dir:', autostartDir);

try {
  if (!fs.existsSync(autostartDir)) {
    console.log('Directory does not exist. Attempting to create...');
    fs.mkdirSync(autostartDir, { recursive: true });
    console.log('Directory created.');
  } else {
    console.log('Directory exists.');
  }

  const testFile = path.join(autostartDir, 'test-write-permission.txt');
  fs.writeFileSync(testFile, 'This is a test file to check write permissions.');
  console.log('Success: Wrote to', testFile);
  
  // Clean up
  fs.unlinkSync(testFile);
  console.log('Success: Deleted test file.');

} catch (err) {
  console.error('ERROR:', err.message);
}

console.log('--- DEBUG CHECK END ---');
