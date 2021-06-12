/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

const checkPathType = (myPath) => {
  const fsStats = fs.lstatSync(myPath);
  return fsStats.isFile() ? 'file' : 'folder';
};

const checkExt = (file) => path.extname(file);

const linksExtractor = (file, markdown, line) => {
  const links = [];
  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) => {
    // if con starts with para filtrar los titulos
    if (!href.startsWith('#')) {
      links.push({
        href,
        text,
        file,
        line,
      });
    }
  };
  marked(markdown, { renderer });
  return links;
};

const isFile = (file) => new Promise((resolve, reject) => {
  if (checkExt(file) === '.md') {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err);
      data = data.split('\n').map((line, index) => linksExtractor(file, line, index + 1)).filter((el) => el.length !== 0);
      if (data.length !== 0) data = data.reduce((value1, value2) => value1.concat(value2));
      resolve(data);
    });
  } else {
    reject(new Error('File must be Markdown'));
  }
});

const isFolder = (folder, options) => new Promise((resolve, reject) => {
  fs.readdir(folder, 'utf8', (err, files) => {
    const folderPromises = files.map((file) => {
      const filePath = `${folder}/${file}`;
      if (checkPathType(filePath) === 'folder') mdLinks(filePath, options);
      if (checkPathType(filePath) === 'file') return isFile(filePath);
    });
    Promise.all(folderPromises).then((filesData) => {
      const reduced = filesData.filter((el) => el && el.length !== 0).reduce((value1, value2) => value1.concat(value2));
      resolve(reduced);
    }).catch((error) => reject(error));
  });
});

const fetchLinks = (url) => new Promise((resolve, reject) => {
  const fetchResult = {};
  fetch(url.href)
    .then((res) => {
      fetchResult.status = res.status;
      fetchResult.ok = res.statusText;
      resolve(fetchResult);
    })
    .catch((err) => {
      fetchResult.ok = 'FAIL';
      resolve(fetchResult);
    });
});

const mdLinks = (myPath, options) => new Promise((resolve, reject) => {
  myPath = path.normalize(path.resolve(myPath));
  if (!fs.existsSync(myPath)) {
    reject(new Error('The path does not exists. Must enter an existing path'));
  } else {
    switch (checkPathType(myPath)) {
      case 'file':
        isFile(myPath)
          .then((linksArr) => {
            if (options.validate) {
              const fetchedData = linksArr.map((link) => fetchLinks(link));
              Promise.all(fetchedData).then((fetchArr) => {
                for (let i = 0; i < linksArr.length; i++) {
                  Object.assign(linksArr[i], fetchArr[i]);
                }
                resolve(linksArr);
              });
            } else {
              resolve(linksArr);
            }
          })
          .catch((err) => reject(err));
        break;
      case 'folder':
        isFolder(myPath)
          .then((totalLinks) => console.log(totalLinks));
        break;
      default:
        break;
    }
  }
});

module.exports = mdLinks;
