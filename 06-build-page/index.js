const fs = require('node:fs/promises');
const path = require('node:path');
const { EOL } = require('node:os');

const projectDist = path.join(__dirname, 'project-dist');
const inputCssFolder = path.join(__dirname, 'styles');
const inputHtmlFolder = path.join(__dirname, 'components');
const inputAssetsFolder = path.join(__dirname, 'assets/');
const outputHTMLFile = path.join(projectDist, 'index.html');
const outputCssFile = path.join(projectDist, 'style.css');
const outputAssetsFolder = path.join(projectDist, 'assets');

function copyStyles() {
  return fs.readdir(inputCssFolder, { withFileTypes: true })
    .then((files) => {
      let fileNames = files
        .filter(file => file.isFile() && path.extname(file.name) === '.css')
        .map(file => file.name);

      return Promise.all(fileNames.map((name) => fs.readFile(path.join(inputCssFolder, name), 'utf8')));
    })
    .then((cssFilesData) => {
      const newCss = cssFilesData.join(EOL);

      return fs.writeFile(outputCssFile, newCss);
    })
    .then(() => console.log('style.css created'))
    .catch((error) => {
      console.warn('style.css failed');
      return Promise.reject(error);
    });
}

async function copyFolderItemsRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src, { withFileTypes: true });

  await Promise.all(files.map((file) => {
    const from = path.join(src, file.name);
    const to = path.join(dest, file.name);

    return file.isDirectory() ? copyFolderItemsRecursive(from, to) : fs.copyFile(from, to);
  }));
}

async function copyAssets() {
  try {
    await copyFolderItemsRecursive(inputAssetsFolder, outputAssetsFolder);
    console.log('assets copied');

    return Promise.resolve();
  } catch (error) {
    console.warn('assets copy failed');

    return await Promise.reject(error);
  }
}

async function inlineComponentsHTML() {
  try {
    let [html, componetsFiles] = await Promise.all([
      fs.readFile(path.join(__dirname, 'template.html'), 'utf8'),
      fs.readdir(inputHtmlFolder, { withFileTypes: true })
    ]);

    let fileNames = componetsFiles
      .filter(file => file.isFile() && path.extname(file.name) === '.html')
      .map(file => file.name);

    const components = await Promise.all(
      fileNames.map((name) =>
        fs.readFile(path.join(inputHtmlFolder, name), 'utf8')
          .then((data) => ({
            name,
            data
          }))));

    components.forEach((component) => {
      let componentName = path.basename(component.name, path.extname(component.name));
      html = html.replace(`{{${componentName}}}`, component.data);
    });

    await fs.writeFile(outputHTMLFile, html);

    console.log('index.html created');
  } catch (error) {
    console.log('index.html failed');

    return Promise.reject(error);
  }
}

function createBundle() {
  fs.rm(projectDist, { recursive: true })
    .catch(() => { })
    .then(() => fs.mkdir(projectDist, { recursive: true }))
    .then(() => Promise.all([
      inlineComponentsHTML(),
      copyStyles(),
      copyAssets(),
    ]))
    .then(() => console.log('bundle created'))
    .catch((error) => {
      console.warn('bundle failed');
      console.warn(error);
    });
}

createBundle();
