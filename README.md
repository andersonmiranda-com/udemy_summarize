# Udemy Course Summary with ChatGPT

Enhance your [Udemy](https://www.udemy.com/) learning experience by
automatically generating concise summaries of your courses with the Udemy Course
Summary tool, powered by ChatGPT. This innovative tool simplifies your learning
process by summarizing extensive course content into digestible sections,
enabling you to grasp key concepts swiftly and efficiently.

## How It Works

Follow these straightforward steps to leverage the power of ChatGPT in
summarizing your Udemy courses:

1. **Extension Installation:** Begin by installing the 'Udemy Summary' extension
   on Chrome to integrate the summarization feature directly into your browser.

   [Get the Udemy Summary Extension](https://chromewebstore.google.com/detail/udemy-summary-harness-the/dcclmkicpmnakdmgehlbbcagfpkdpkdl)

2. **Configuration:** Obtain an OpenAI API key and configure the extension to
   connect with ChatGPT's powerful AI capabilities.
3. **Course Material Extraction:** Convert your Udemy course into a
   comprehensive PDF, encapsulating all the material for the summarization
   process.
4. **Script Execution:** Utilize the provided script to generate a succinct
   summary for each course section, aiding in quick review and reinforcement of
   learned material.

## Step-by-Step Guide to Using the Script

1. **Install Dependencies:** Ensure that your system has all the necessary
   components.

   ```bash
   yarn install
   ```

2. **Set Up Configuration:** Create a `.env` file at the root of your project
   folder and insert your OpenAI API key.

   ```bash
   API_KEY="Your API KEY here"
   ```

3. **PDF to Text Conversion:** Transform the course PDF into a text file for
   processing.

   ```bash
   node index.js --pdf2txt filename.pdf
   ```

4. **Content Summarization:** The script intelligently divides the text into
   individual lessons and generates summaries for each, identifying lesson
   titles by the format `[number]. [lesson title]`.

   ```bash
   node index.js --summarize filename.txt
   ```

   The output is a text file with the `_summary` suffix, providing a
   consolidated overview of each lesson.

### Additional Functionality

- **Markdown File Generation:** Convert the summarized text into a Markdown
  file, facilitating integration with platforms like
  [Notion](https://www.notion.so/) or [Obsidian](https://obsidian.md/). The
  filename will be used as main title on markdown file.
  ```bash
  node index.js --txt2md filename.txt
  ```
- **PDF Creation from Markdown:** For those preferring a PDF format, easily
  convert your Markdown files into PDFs.
  ```bash
  node index.js --md2pdf filename.md
  ```

## Command Line Usage

Navigate the tool with ease using the following syntax:

```bash
node index.js [parameter] filename.ext
```

### Parameters:

| Parameter           | Usage                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------ |
| --pdf2txt           | Generate MD from a TXT                                                                     |
| --summarize         | Generate a summary of each chapter from a TXT                                              |
| --txt2md            | Generate an MD from an TXT                                                                 |
| --md2pdf            | Generate a PDF from an MD                                                                  |
| --language <string> | Language to be used: `en` (default), `es` or `pt`. Texts will be automatically translated. |
