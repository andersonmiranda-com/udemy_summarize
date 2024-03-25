require('dotenv').config();
const path = require('path');
const fs = require('fs/promises');
const pdf = require('pdf-parse');
const { mdToPdf } = require('md-to-pdf');
const { getTitlePrompt, getContentPrompt } = require('./prompts');
const { options, filePath, fileExtension } = require('./options');
const OpenAI = require('openai');

const apiKey = process.env.API_KEY;

const baseName = path.basename(filePath, fileExtension);
const dirName = path.dirname(filePath);

const openai = new OpenAI({ apiKey });

const summarizeTitle = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: getTitlePrompt(text, options.language)
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

const summarizeText = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: getContentPrompt(text, options.language)
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
      const newTitle = await summarizeTitle(title, options.language);
      const summary = await summarizeText(content);
      const chapterSummaryTXT = `${newTitle}\n\n${summary}\n\n\n`;
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
    await fs.writeFile(textFilePath, data.text.trim());
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

module.exports = {
  summarizeTextFile,
  convertTXTtoMD,
  convertMDtoPDF,
  convertPDFtoTXT
};
