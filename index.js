const fs = require('fs/promises');
const pdf = require('pdf-parse');
const { mdToPdf } = require('md-to-pdf');
require('dotenv').config();

const apiKey = process.env.API_KEY;
const path = require('path');
const OpenAI = require('openai');

const args = process.argv.slice(2);
const summarizeFlag = args.includes('--summarize');
const pdfFlag = args.includes('--pdf2txt');
const mdFlag = args.includes('--txt2md');
const md2pdfFlag = args.includes('--md2pdf');

const filePath = args.find((arg) => !arg.startsWith('-'));
const fileExtension = path.extname(filePath).toLowerCase();
const baseName = path.basename(filePath, fileExtension);
const dirName = path.dirname(filePath);

const openai = new OpenAI({ apiKey });

const summarizeText = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Hágame un resumen del texto en varios párrafos cortos. No usar expresiones como "este texto..." o "el texto...". :\n\n${text}`
        }
      ],
      temperature: 0.2,
      max_tokens: 2000 // Adjust if needed
    });
    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error('Error summarizing chapter:', err);
    throw err;
  }
};

const processFile = async () => {
  try {
    if (pdfFlag && fileExtension === '.pdf') {
      convertPDFtoTXT();
    } else if (fileExtension === '.txt' && summarizeFlag) {
      summarizeTextFile();
    } else if (fileExtension === '.txt' && mdFlag) {
      convertTXTtoMD();
    } else if (fileExtension === '.md' && md2pdfFlag) {
      convertMDtoPDF();
    } else {
      console.log('Invalid option or file type.');
    }
  } catch (err) {
    console.error('Error processing file:', err);
  }
};

const summarizeTextFile = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const chapters = data.split(/\n(?=\d+\. )/);

    const txtFilePath = path.join(dirName, `${baseName}_summary.txt`);
    await fs.writeFile(txtFilePath, '');

    for (let chapter of chapters) {
      const titleEndIndex = chapter.indexOf('\n');
      const title = chapter.substring(0, titleEndIndex).trim();
      const content = chapter.substring(titleEndIndex + 1).trim();
      const summary = await summarizeText(content);
      const chapterSummaryTXT = `${title}\n\n${summary}\n\n\n`;
      await fs.appendFile(txtFilePath, chapterSummaryTXT);
      console.log(`Saved summary for ${title}`);
    }

    console.log('All chapters have been processed and saved.');
  } catch (err) {
    console.error('Error processing text file:', err);
  }
};

const convertTXTtoMD = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const chapters = data.split(/\n(?=\d+\. )/);

    const mdFilePath = path.join(dirName, `${baseName}.md`);

    await fs.writeFile(mdFilePath, `# ${formatTitle(baseName)}\n\n`);

    for (let chapter of chapters) {
      const titleEndIndex = chapter.indexOf('\n');
      const title = chapter.substring(0, titleEndIndex).trim();
      const content = chapter.substring(titleEndIndex + 1).trim();

      const chapterMD = `## ${title}\n${content}\n\n`;
      await fs.appendFile(mdFilePath, chapterMD);
      console.log(`Markdown entry for ${title}`);
    }
    console.log('All chapters have been processed and saved.');
  } catch (err) {
    console.error('Error processing text file:', err);
  }
};

const convertMDtoPDF = async () => {
  try {
    const mdFilePath = path.join(dirName, `${baseName}.md`);
    const pdfFilePath = path.join(dirName, `${baseName}.pdf`);
    const pdf = await mdToPdf(
      {
        path: mdFilePath
      },
      {
        stylesheet: 'md2pdf.css',
        document_title: formatTitle(baseName),
        stylesheet_encoding: 'utf-8',
        pdf_options: {
          format: 'A4',
          margin: '20mm'
        }
      }
    ).catch(console.error);
    if (pdf) {
      fs.writeFile(pdfFilePath, pdf.content);
    }
  } catch (err) {
    console.error('Error processing text file:', err);
  }
};

const convertPDFtoTXT = async () => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    const textFilePath = path.join(dirName, `${baseName}.txt`);
    await fs.writeFile(textFilePath, data.text);
    console.log(`Converted PDF to text: ${textFilePath}`);
  } catch (err) {
    console.error('Error processing PDF file:', err);
  }
};

const formatTitle = (title) => {
  let formatedTitle = title.replace(/[_()-]/g, ' ');
  formatedTitle = formatedTitle.replace('summary', '');
  formatedTitle = formatedTitle.toLowerCase();
  formatedTitle =
    formatedTitle.charAt(0).toUpperCase() + formatedTitle.slice(1);
  return formatedTitle;
};

if (process.argv.length < 4) {
  console.log('Please provide a command or file path.');
} else {
  processFile();
}
