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

  // Handle lists with nesting support
  markdown = markdown.split('\n').reduce((acc, line) => {
      // Match unordered list items (- or *)
      if (/^\s*[\*\-]\s+(.*)/.test(line)) {
          const depth = line.match(/^\s*/)[0].length;
          const listItem = line.trim().replace(/^[\*\-]\s+/, '<li>') + '</li>';
          return acc + `<ul style="margin-left: ${depth * 20}px;">${listItem}</ul>`;
      }
      // Match ordered list items (1., 2., etc.)
      else if (/^\s*\d+\.\s+(.*)/.test(line)) {
          const depth = line.match(/^\s*/)[0].length;
          const listItem = line.trim().replace(/^\d+\.\s+/, '<li>') + '</li>';
          return acc + `<ol style="margin-left: ${depth * 20}px;">${listItem}</ol>`;
      }
      // Regular lines
      else {
          return acc + line + '\n';
      }
  }, '');

  // Replace inline code and code blocks
  markdown = markdown.replace(/`(.*?)`/gim, '<code>$1</code>');
  markdown = markdown.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

  // Replace links and images
  markdown = markdown.replace(/\[([^\[]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');
  markdown = markdown.replace(/\!\[([^\[]*)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" />');

  // Replace horizontal rules
  markdown = markdown.replace(/^\s*[-\*]{3,}\s*$/gim, '<hr />');

  // Replace line breaks
  markdown = markdown.replace(/\n\n/gim, '<br /><br />');
  markdown = markdown.replace(/\n/gim, '<br />');

  return markdown.trim();
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
