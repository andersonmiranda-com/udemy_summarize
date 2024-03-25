const { options, fileExtension } = require('./options');
const {
  summarizeTextFile,
  convertTXTtoMD,
  convertMDtoPDF,
  convertPDFtoTXT
} = require('./utils');

const processFile = async () => {
  try {
    if (options.pdf2txt && fileExtension === '.pdf') {
      convertPDFtoTXT();
    } else if (fileExtension === '.txt' && options.summarize) {
      summarizeTextFile();
    } else if (fileExtension === '.txt' && options.txt2md) {
      convertTXTtoMD();
    } else if (fileExtension === '.md' && options.md2pdf) {
      convertMDtoPDF();
    } else {
      console.log('Invalid option or file type.');
    }
  } catch (err) {
    console.error('Error processing file:', err);
  }
};

if (process.argv.length < 4) {
  console.log('Please provide a command or file path.');
} else {
  processFile();
}
