const fs = require('node:fs');
const path = require('node:path');

const rr = fs.createReadStream(path.join(__dirname, 'text.txt'));

rr.on('readable', () => {
  rr.read();
});

rr.pipe(process.stdout);
