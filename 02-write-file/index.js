const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { EOL } = require("node:os");

const filePath = path.join(__dirname, "text.txt");

fs.writeFile(filePath, '', (err) => {
  if (err) return console.log(err);

  function writeToFile(text) {
    if (text === 'exit') {
      return rl.close();
    }

    writeStream.write(`${text}${EOL}`);
  }

  const writeStream = fs.createWriteStream(filePath);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Want some pizza? ', writeToFile);

  rl.on('line', writeToFile);

  rl.on('close', function () {
    console.log(`${EOL}Bye Bye!`);
    process.exit(0);
  });
});
