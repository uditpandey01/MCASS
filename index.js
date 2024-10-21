const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const glob = require('glob');
const config = require('./Mcass.config.js');
const generatedClasses = new Set();
const generateCss = (className) => {
  if (className.startsWith('text--')) {
    const value = className.split('--')[1];
    return `.${className} { font-size: ${value}; }`;
  }
  if (className.startsWith('color--')) {
    const value = className.split('--')[1];
    return `.${className} { color: ${value}; }`;
  }
  return ''; 
};


function appendCss(css) {
  const outputPath = path.join(__dirname, 'dist','csslib.css');
  fs.appendFileSync(outputPath, css);
}




function processFileContent(content) {
  const matches = content.match(/class=["']([^"']*)["']/g);

  if (matches) {
    const classNamesSet = new Set(); 

    matches.forEach((match) => {
      const classNames = match.replace(/class=["']/g, '').replace(/["']/g, '').split(' ');
      classNames.forEach((className) => {
        if (className.trim()) {
          classNamesSet.add(className); 
        }
      });
    });


    classNamesSet.forEach((className) => {
      if (className.trim() && !generatedClasses.has(className)) { 
        const css = generateCss(className); 
        if (css) {
          appendCss(css); 
          generatedClasses.add(className); 
        }
      }
    });
  }
}



function initialScan() {
  config.content.forEach((filePathPattern) => {
    const files = glob.sync(filePathPattern); 

    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      processFileContent(content); 
    });
  });

  console.log('Initial scan complete. Watching for changes...');
}



function startWatcher() {
  const watcher = chokidar.watch(config.content, { ignoreInitial: true });

  watcher.on('change', (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    processFileContent(content); 
  });

  console.log('Watching for class changes...');
}

initialScan(); 
startWatcher(); 
