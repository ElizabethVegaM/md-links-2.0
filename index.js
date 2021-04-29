/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

const links = [];

module.exports = (myPath, options) => new Promise((resolve, reject) => {
  console.log(options);
  myPath = path.normalize(path.resolve(myPath));
  console.log(myPath);
  if (!fs.existsSync(myPath)) {
    console.log('Debe ingresar un archivo o directorio');
  } else {
    switch (checkPathType(myPath)) {
      case 'file':
        isFile(myPath)
          .then((data) => {
            if (options.validate || (options.validate && options.stats)) {
              data.map(link => fetchLinks(link));
            } else {
              resolve(data);
            }
          })
          .catch((err) => reject(err));
        break;
      case 'folder':
        isFolder(myPath);
        break;
      default:
        break;
    }
  }
});

const checkPathType = (myPath) => {
  const fsStats = fs.lstatSync(myPath);
  return fsStats.isFile() ? 'file' : 'folder';
};

const checkExt = (file) => path.extname(file);

const isFolder = (folder) => {
  console.log('directorio', folder);
};

const isFile = (file) => new Promise((resolve, reject) => {
  if (checkExt(file) === '.md') {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err);
      data = linksExtractor(file, data);
      console.log(data);
      resolve(data);
    });
  } else {
    console.log('El archivo debe ser de tipo Markdown');
  }
});

const linksExtractor = (file, markdown) => {
  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) => {
    links.push({
      href,
      text,
      file,
      status: '',
      statusCode: '',
    });
  };
  marked(markdown, { renderer });
  return links;
};

const fetchLinks = (url) => new Promise((resolve, reject) => {
  fetch(url.href)
    .then((res) => {
      console.log(res);
    } res)
    .catch((err) => reject(err));
});
