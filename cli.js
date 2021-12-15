#!/usr/bin/env node
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const chalk = require('chalk');
const mdLinks = require('./index');

const [, , ...args] = process.argv;
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
      console.log(chalk.bold('These are the stats for the given path:\n'));
      if (options.validate) {
        console.log(
          `${chalk.bgGrey.bold('Total')}: ${chalk.bold(
            statsInfo.totalLinks,
          )}, ${chalk.bgBlueBright.bold('Unique')}: ${chalk.bold(
            statsInfo.uniqueLinks,
          )}, ${chalk.bgRed.bold('Broken')}: ${chalk.bold(
            statsInfo.brokenLinks,
          )}`,
        );
      } else {
        console.log(
          `${chalk.bgGrey.bold('Total')}: ${chalk.bold(
            statsInfo.totalLinks,
          )}, ${chalk.bgBlueBright.bold('Unique')}: ${chalk.bold(
            statsInfo.uniqueLinks,
          )}`,
        );
      }
    } else {
      console.log(chalk.bold('These are the links found in the given path:'));
      links.forEach((link) => {
        if (options.validate) {
          console.log(
            `\n${chalk.bgGrey('href:')} ${chalk.magenta(link.href)}\n${chalk.bgGrey('text:')} ${chalk.cyan(link.text)}\n${chalk.bgGrey('file:')} ${link.file} - ${link.line}\n${chalk.bgGrey('code:')} ${link.ok === 'OK' ? chalk.green(`${link.status} - ${link.ok}`) : chalk.red(`${link.status} - ${link.ok}`)}`,
          );
        } else {
          console.log(
            `\n${chalk.bgGrey('href:')} ${chalk.magenta(link.href)}\n${chalk.bgGrey('text:')} ${chalk.cyan(link.text)}\n${chalk.bgGrey('file:')} ${chalk.green(link.file)} - ${chalk.green(link.line)}`,
          );
        }
      });
    }
  })
  .catch((error) => console.error(error));

mdLinks(args[0], options.validate)
  .then((links) => {
    if (options.stats) {
      const statsInfo = stats(links);
      console.log(chalk.bold('These are the stats for the given path:\n'));
      if (options.validate) {
        console.log(
          `${chalk.bgGrey.bold('Total')}: ${chalk.bold(
            statsInfo.totalLinks,
          )}, ${chalk.bgBlueBright.bold('Unique')}: ${chalk.bold(
            statsInfo.uniqueLinks,
          )}, ${chalk.bgRed.bold('Broken')}: ${chalk.bold(
            statsInfo.brokenLinks,
          )}`,
        );
      } else {
        console.log(
          `${chalk.bgGrey.bold('Total')}: ${chalk.bold(
            statsInfo.totalLinks,
          )}, ${chalk.bgBlueBright.bold('Unique')}: ${chalk.bold(
            statsInfo.uniqueLinks,
          )}`,
        );
      }
    } else {
      console.log(chalk.bold('These are the links found in the given path:'));
      links.forEach((link) => {
        if (options.validate) {
          console.log(
            `\n${chalk.bgGrey('href:')} ${chalk.magenta(link.href)}\n${chalk.bgGrey('text:')} ${chalk.cyan(link.text)}\n${chalk.bgGrey('file:')} ${link.file} - ${link.line}\n${chalk.bgGrey('code:')} ${link.ok === 'OK' ? chalk.green(`${link.status} - ${link.ok}`) : chalk.red(`${link.status} - ${link.ok}`)}`,
          );
        } else {
          console.log(
            `\n${chalk.bgGrey('href:')} ${chalk.magenta(link.href)}\n${chalk.bgGrey('text:')} ${chalk.cyan(link.text)}\n${chalk.bgGrey('file:')} ${chalk.green(link.file)} - ${chalk.green(link.line)}`,
          );
        }
      });
    }
  })
  .catch((error) => console.error(error));
