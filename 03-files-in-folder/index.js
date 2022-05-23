const fs = require("node:fs");
const path = require("node:path");
const { readdir, stat } = require("node:fs/promises");

const folderPath = path.join(__dirname, "secret-folder");

readdir(folderPath, { withFileTypes: true })
  .then((files) => {
    let fileNames = files
      .filter(file => file.isFile())
      .map(file => file.name);

    return Promise.all(fileNames.map((name) =>
      stat(path.join(folderPath, name)).then((stats) => ({
        name,
        stats,
      }))));
  })
  .then((files) => {
    files.forEach((file) => {
      let fileName = path.basename(file.name, path.extname(file.name));
      let fileExtantion = path.extname(file.name).replace('.', '');
      let fileSizeKb = file.stats.size / 1024;

      console.log(
        `${fileName} - ${fileExtantion} - ${fileSizeKb}kb`
      );
    });
  })
  .catch((error) => {
    console.log(error)
  })
