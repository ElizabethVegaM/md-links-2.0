/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
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
      if (data.length !== 0) data = data.flat();
      resolve(data);
    });
  } else {
    reject(new Error('File must be Markdown'));
  }
});

const getFiles = (folder) => {
  const files = [];
  for (const file of fs.readdirSync(folder)) {
    const fullFile = `${folder}/${file}`;
    if (checkPathType(fullFile) === 'folder') {
      getFiles(fullFile).forEach((el) => files.push(`${file}/${el}`));
    } else {
      files.push(file);
    }
  }
  return files;
};

const isFolder = (folder) => new Promise((resolve, reject) => {
  const files = getFiles(folder);
  const filePromises = files.map((file) => isFile(`${folder}/${file}`));
  Promise.all(filePromises).then((each) => {
    resolve(each.filter((arr) => arr.length !== 0).flat());
  })
    .catch((err) => reject(err));
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

const fileOrFolder = (myPath, validate) => new Promise((resolve, reject) => {
  myPath = path.normalize(path.resolve(myPath));
  if (!fs.existsSync(myPath)) {
    reject(new Error('The path does not exists. Must enter an existing path'));
  } else {
    switch (checkPathType(myPath)) {
      case 'file':
        isFile(myPath)
          .then((linksArr) => resolve(linksArr))
          .catch((err) => reject(err));
        break;
      case 'folder':
        isFolder(myPath, validate)
          .then((totalLinks) => resolve(totalLinks))
          .catch((err) => reject(err));
        break;
      default:
        break;
    }
  }
});

const mdLinks = (myPath, validate) => new Promise((resolve, reject) => {
  fileOrFolder(myPath, validate).then((linksArr) => {
    if (validate) {
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
  });
});

module.exports = mdLinks;
