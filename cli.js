#!/usr/bin/env node
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
// const chalk = require('chalk');
const mdLinks = require('./index');

const [,, ...args] = process.argv;
const options = {
  validate: args.includes('--validate'),
  stats: args.includes('--stats'),
};

const stats = (linksArray) => {
  const summary = {
    totalLinks: linksArray.length,
    uniqueLinks: 0,
    brokenLinks: 0,
  };

  const setArr = new Set(linksArray.map((item) => item.href)).size;

  if (linksArray.length !== setArr) summary.uniqueLinks = linksArray.length - setArr;

  linksArray.forEach((element) => {
    if (element.ok && element.ok.includes('FAIL')) summary.brokenLinks++;
  });

  return summary;
};

mdLinks(args[0], options.validate)
  .then((links) => {
    if (options.stats) {
      const statsInfo = stats(links);
      if (options.validate) {
        console.log(`Total Links: ${statsInfo.totalLinks}, Unique: ${statsInfo.uniqueLinks}, Broken: ${statsInfo.brokenLinks}`);
      } else {
        console.log(`Total Links: ${statsInfo.totalLinks}, Unique: ${statsInfo.uniqueLinks}`);
      }
    } else {
      console.log(links);
    }
  })
  .catch((error) => console.error(error));
