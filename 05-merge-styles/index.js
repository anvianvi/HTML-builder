const fs = require("node:fs");
const path = require("node:path");
const { EOL } = require("node:os");
const { readdir, copyFile, mkdir, rm, readFile, writeFile } = require("node:fs/promises");

const inputFolder = path.join(__dirname, "styles");
const outputFolder = path.join(__dirname, "project-dist");
const outputFile = path.join(outputFolder, 'bundle.css');

rm(outputFile, { recursive: true })
  .catch(() => { })
  .then(() => readdir(inputFolder, { withFileTypes: true }))
  .then((files) => {
    let fileNames = files
      .filter(file => file.isFile() && path.extname(file.name) === '.css')
      .map(file => file.name);

    return Promise.all(fileNames.map((name) => readFile(path.join(inputFolder, name), 'utf8')));
  })
  .then((cssFilesData) => {
    const newCss = cssFilesData.join(EOL);

    return writeFile(path.join(outputFolder, 'bundle.css'), newCss)
  })
  .then(() => console.log('bundle.css created'))
  .catch(console.warn)