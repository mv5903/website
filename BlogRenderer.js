const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

function markdownToHtml(markdown) {
    // Replace headers (e.g., # Header -> <h1>Header</h1>)
    markdown = markdown.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    markdown = markdown.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    markdown = markdown.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Replace bold text (e.g., **bold** or __bold__ -> <strong>bold</strong>)
    markdown = markdown.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    markdown = markdown.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // Replace italic text (e.g., *italic* or _italic_ -> <em>italic</em>)
    markdown = markdown.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    markdown = markdown.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Replace strikethrough (e.g., ~~text~~ -> <del>text</del>)
    markdown = markdown.replace(/~~(.*?)~~/gim, '<del>$1</del>');

    // Replace blockquotes (e.g., > Quote -> <blockquote>Quote</blockquote>)
    markdown = markdown.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Replace unordered lists (e.g., - Item or * Item -> <ul><li>Item</li></ul>)
    markdown = markdown.replace(/^\s*[\*\-]\s+(.*)$/gim, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*<\/li>\s*)+/gim, '<ul>$&</ul>');

    // Replace ordered lists (e.g., 1. Item -> <ol><li>Item</li></ol>)
    markdown = markdown.replace(/^\d+\.\s+(.*)$/gim, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*<\/li>\s*)+/gim, '<ol>$&</ol>');

    // Replace inline code (e.g., `code` -> <code>code</code>)
    markdown = markdown.replace(/`(.*?)`/gim, '<code>$1</code>');

    // Replace code blocks (e.g., ```code``` -> <pre><code>code</code></pre>)
    markdown = markdown.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

    // Replace links (e.g., [text](url) -> <a href="url">text</a>)
    markdown = markdown.replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');

    // Replace images (e.g., ![alt text](image.jpg) -> <img src="image.jpg" alt="alt text">)
    markdown = markdown.replace(/\!\[([^\[]*)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" />');

    // Replace horizontal rules (e.g., --- or *** -> <hr />)
    markdown = markdown.replace(/^\s*[-\*]{3,}\s*$/gim, '<hr />');

    // Replace line breaks (two spaces at end of line -> <br />)
    markdown = markdown.replace(/\n\n/gim, '<br /><br />');
    markdown = markdown.replace(/\n/gim, '<br />');

    return markdown.trim(); // Remove leading/trailing whitespace
}

app.get('/blogs', (req, res) => {
  const directoryPath = path.join(__dirname, './blog');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    
    // Filter only .md files
    const mdFiles = files.filter(file => path.extname(file) === '.md');
    
    // Read each .md file and convert to HTML
    const blogs = mdFiles.map(file => {
      const filePath = path.join(directoryPath, file);
      const markdownContent = fs.readFileSync(filePath, 'utf8');
      const htmlContent = markdownToHtml(markdownContent);

      const styles = fs.readFileSync(path.join(__dirname, './Blog.css'), 'utf8');

      return {
        name: path.basename(file, '.md'), // Use the filename without extension as the blog name
        content: htmlContent + `<style>${styles}</style>`
      };
    });
    
    res.json(blogs); // Return the JSON response
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
