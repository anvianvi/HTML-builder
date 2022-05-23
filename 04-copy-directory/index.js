const fs = require("node:fs");
const path = require("node:path");
const { readdir, copyFile, mkdir, rm } = require("node:fs/promises");

const originalFolder = path.join(__dirname, "files");
const copyFolder = path.join(__dirname, "files-copy");

rm(copyFolder, { recursive: true })
  .catch(() => {})
  .then(() => mkdir(copyFolder, { recursive: true }))
  .then(() => readdir(originalFolder, { withFileTypes: true }))
  .then((files) => {

    let fileNames = files
      .filter(file => file.isFile())
      .map(file => file.name);

    return Promise.all(fileNames.map((name) => copyFile(path.join(originalFolder, name), path.join(copyFolder, name))));
  })
  .catch(console.warn)
  