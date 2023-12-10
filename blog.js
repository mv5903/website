const http = require('http');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const wpm = 200; // words per minute

// Function to convert MD to HTML
function convertMarkdownToHTML(mdContent) {
  return marked.parse(mdContent);
}

function getReadingTime(content) {
  const words = content.split(' ');
  const readingTime = Math.ceil(words.length / wpm);
  return readingTime;
}

// Function to serve the HTML content
function serveHTML(content, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(content);
}

// Function to read the MD file and convert it to HTML
function convertMDFileToHTML(filePath, res) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      if (err.message.includes("no such file or directory")) {
        res.end(`File ${filePath.substring(filePath.lastIndexOf("\\") + 1)} not found`);
      } else {
        res.end('Internal Server Error');
      }
    } else {
      let htmlContent = convertMarkdownToHTML(data);
      let priorContent = '<link rel="stylesheet" href="blogstyle.css">\n<i>(Approx. ' + getReadingTime(htmlContent) + " min read)</i>";
      htmlContent = priorContent + htmlContent; 
      serveHTML(htmlContent, res);
    }
  });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url.includes('/img/')) {
    const requestedFileName = req.url.substring(10); 
    const imgFilePath = path.join(__dirname, 'blog/img', requestedFileName);
    fs.readFile(imgFilePath, (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(data);
      }
    });
  }
  else if (req.url.includes('/blogstyle.css')) {
    const cssFilePath = path.join(__dirname, 'blogstyle.css'); 
    fs.readFile(cssFilePath, (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  }
  else if (req.url.includes('/favicon.ico')) {
    const cssFilePath = path.join(__dirname, 'blogstyle.css'); 
    fs.readFile(cssFilePath, (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  }
  else if (req.url.startsWith('/blog/')) {
    const requestedFileName = req.url.substring(6); 
    const mdFilePath = path.join(__dirname, 'blog', requestedFileName + '.md'); 
    convertMDFileToHTML(mdFilePath, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server on port 3000 (you can change the port as needed)
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
