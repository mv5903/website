const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

function markdownToHtml(markdown) {
  // Replace headers
  markdown = markdown.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  markdown = markdown.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  markdown = markdown.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Replace bold, italic, and strikethrough text
  markdown = markdown.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  markdown = markdown.replace(/__(.*?)__/gim, '<strong>$1</strong>');
  markdown = markdown.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  markdown = markdown.replace(/_(.*?)_/gim, '<em>$1</em>');
  markdown = markdown.replace(/~~(.*?)~~/gim, '<del>$1</del>');

  // Replace blockquotes
  markdown = markdown.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Handle lists with nesting
  const lines = markdown.split('\n');
  let html = '';
  let listStack = [];

  lines.forEach((line) => {
      let unorderedMatch = line.match(/^(\s*)[\*\-]\s+(.*)/);
      let orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)/);

      if (unorderedMatch || orderedMatch) {
          const [, indent, content] = unorderedMatch || orderedMatch;
          const listTag = unorderedMatch ? 'ul' : 'ol';
          const depth = indent.length / 2;

          // Close lists if we're stepping back in depth
          while (listStack.length > depth) {
              html += `</${listStack.pop()}>`;
          }

          // Open new lists if we're stepping deeper
          while (listStack.length < depth) {
              html += `<${listTag}>`;
              listStack.push(listTag);
          }

          html += `<li>${content}</li>`;
      } else {
          // Close any open lists if a non-list line is encountered
          while (listStack.length) {
              html += `</${listStack.pop()}>`;
          }
          html += line + '\n';
      }
  });

  // Close any remaining open lists
  while (listStack.length) {
      html += `</${listStack.pop()}>`;
  }

  // Replace inline code and code blocks
  html = html.replace(/`(.*?)`/gim, '<code>$1</code>');
  html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

  // Replace links and images
  html = html.replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');
  html = html.replace(/\!\[([^\[]*)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" />');

  // Replace horizontal rules
  html = html.replace(/^\s*[-\*]{3,}\s*$/gim, '<hr />');

  // Replace line breaks
  html = html.replace(/\n\n/gim, '<br /><br />');
  html = html.replace(/\n/gim, '<br />');

  return html.trim();
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
