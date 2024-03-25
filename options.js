const path = require('path');
const { program } = require('commander');
program
  .option('--summarize', 'create a summary of the text')
  .option('--pdf2txt', 'convert a PDF file to text')
  .option('--txt2md', 'convert a text file to markdown')
  .option('--md2pdf', 'convert a markdown file to PDF')
  .option('-l, --language <en | es |pt>', 'language of the text', 'en');

program.parse(process.argv);

const options = program.opts();

const filePath = program.args[0];
const fileExtension = path.extname(filePath).toLowerCase();

module.exports = { options, filePath, fileExtension };
