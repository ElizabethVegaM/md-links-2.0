/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
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

const isFile = (file) => {
  let linksArr = null;
  if (checkExt(file) === '.md') {
    try {
      const data = fs.readFileSync(file, 'utf8');
      linksArr = data
        .split('\n')
        .map((line, index) => linksExtractor(file, line, index + 1))
        .filter((el) => el.length !== 0);
      if (linksArr.length !== 0) linksArr = linksArr.flat();
      return linksArr;
    } catch (err) {
      throw new Error('File must be Markdown');
    }
  }
  return linksArr;
};

// example taken from https://stackoverflow.com/a/65938541
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
  Promise.all(filePromises)
    .then((each) => {
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

const fileOrFolder = (myPath) => new Promise((resolve, reject) => {
  const absolutePath = path.normalize(path.resolve(myPath));
  if (!fs.existsSync(absolutePath)) {
    reject(
      new Error('The path does not exists. Must enter an existing path'),
    );
  } else {
    switch (checkPathType(absolutePath)) {
      case 'file':
        resolve(isFile(absolutePath));
        break;
      case 'folder':
        resolve(isFolder(absolutePath));
        break;
      default:
        break;
    }
  }
});

const mdLinks = (myPath, validate) => new Promise((resolve, reject) => {
  if (!myPath) reject(new Error('The "path" argument must be of type string'))
  fileOrFolder(myPath).then((linksArr) => {
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
  })
  .catch((err) => reject(err));
});

module.exports = mdLinks;
