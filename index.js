const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const glob = require('glob');
const config = require('./Mcass.config.js');
const mappings = require('./utilityMappings.js');

const generatedClasses = new Set();

const generateCss = (className) => {
  let responsivePrefix = '';
  let pseudoClass = '';
  let originalClassName = className;  // Save the original class name

  // Check for responsive prefix
  for (const prefix in mappings.responsiveBreakpoints) {
    if (className.startsWith(prefix)) {
      responsivePrefix = prefix;
      className = className.slice(prefix.length); // Remove responsive prefix
      break;
    }
  }

  // Check for pseudo prefix
  for (const prefix in mappings.pseudoClasses) {
    if (className.startsWith(prefix)) {
      pseudoClass = mappings.pseudoClasses[prefix];
      className = className.slice(prefix.length); // Remove pseudo prefix
      break;
    }
  }

  // Get the utility (like 'bg--', 'text--', etc.) and its value (like 'blue', '20px', etc.)
  const utility = Object.keys(mappings.utilities).find((key) => className.startsWith(key));
  if (!utility) return ''; // Skip if utility is not found

  const value = className.slice(utility.length); // Extract the value part
  const cssProperty = mappings.utilities[utility];

  // Escape colon for pseudo-classes in the final class name
  const escapedClassName = originalClassName.replace(/:/g, '\\:');
  
  const cssRule = `.${escapedClassName}${pseudoClass} { ${cssProperty}: ${value}; }`;

  // Handle responsive prefix
  if (responsivePrefix) {
    return `${mappings.responsiveBreakpoints[responsivePrefix]} { ${cssRule} }`;
  }

  return cssRule;
};


function appendCss(css) {
  const outputPath = path.join(__dirname, 'dist', 'csslib.css');
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
