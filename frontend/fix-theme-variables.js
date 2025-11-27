import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Mapping of incorrect variables to correct ones
const variableMap = {
  // Color variables
  '--color-primary': '--primary-color',
  '--color-primary-dark': '--primary-dark',
  '--color-primary-light': '--primary-light',
  '--color-secondary': '--secondary-color',
  '--color-danger': '--error-color',
  '--color-danger-light': '--error-color',
  '--color-success': '--success-color',
  '--color-success-light': '--success-color',
  '--color-warning': '--warning-color',
  '--color-warning-light': '--warning-color',
  '--color-info': '--color-info',
  '--color-info-dark': '--color-info-dark',
  '--color-info-light': '--color-info-light',

  // Text variables
  '--color-text': '--text-primary',
  '--color-text-light': '--text-light',
  '--color-text-secondary': '--text-secondary',

  // Background variables
  '--color-background': '--bg-primary',
  '--color-background-light': '--bg-secondary',

  // Border variables
  '--color-border': '--border-color',

  // Admin specific variables
  '--admin-text-primary': '--text-primary',
  '--admin-text-secondary': '--text-secondary',
  '--admin-bg-primary': '--bg-primary',
  '--admin-bg-secondary': '--bg-secondary',
  '--admin-border': '--border-color',
  '--admin-hover': '--bg-hover',
  '--admin-primary': '--primary-color',
  '--admin-primary-light': '--primary-light',
};

// Find all CSS files in admin components
const cssFiles = glob.sync('src/components/admin/**/*.css', { cwd: __dirname });

console.log('Found CSS files:', cssFiles);

cssFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');

  let modified = false;

  // Replace each incorrect variable with the correct one
  Object.entries(variableMap).forEach(([incorrect, correct]) => {
    const regex = new RegExp(
      `var\\(${incorrect.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\)`,
      'g'
    );
    if (content.includes(`var(${incorrect})`)) {
      content = content.replace(regex, `var(${correct})`);
      modified = true;
      console.log(`Replaced ${incorrect} with ${correct} in ${filePath}`);
    }
  });

  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${filePath}`);
  }
});

console.log('Theme variable fix completed!');
