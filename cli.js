#!/usr/bin/env node
// const chalk = require('chalk');
const mdLinks = require('./index');

const [,, ...args] = process.argv;
const options = {
  validate: args.includes('--validate'),
  stats: args.includes('--stats'),
};

mdLinks(args[0], options.validate)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => console.error(error));
