# MCASS
====================

### Hacktoberfest 2024

Welcome to MCASS, an open-source CSS library project for Hacktoberfest 2024. Your task is to contribute by adding new utility classes to the appropriate CSS files, running the build process, testing, and submitting a Pull Request.

## Getting Started

### Prerequisites

* Node.js (latest version)
* PostCSS (installed globally or locally)

### Installation
1. Fork the repo 
2. Clone the repository: `git clone [repository link]`
3. Install dependencies: `npm install`

## Contributing

### Step 1: Choose a Category

Select the relevant CSS category (e.g., `src/components`, `src/layouts`, `src/utilities`) to add or modify classes.

### Step 2: Add or Modify Classes

Add new classes or modify existing ones in the selected category.

### Step 3: Run the build command

Build the CSS library: `npx postcss src/index.css -o dist/csslib.css`


### Step 4: Test Your Changes

1. run npm i
2. Run `npx postcss src/index.css -o dist/csslib.css` to rebuild the CSS library.
3. Open `test.html` and add your new class to test its functionality.

### Step 5: Remove Test Class

Remove the test class from `test.html`.

### Step 6: Clean Up Output CSS

Remove everything from `dist/output.css`.

### Step 7: Commit and Push Changes

1. Stage changes: `git add .`
2. Commit changes: `git commit -m "brief description of changes"`
3. Push changes: `git push origin your-branch-name`

### Step 8: Create a Pull Request

Create a pull request to merge your changes into the main branch.

## Guidelines

* Follow Tailwind CSS's naming conventions and syntax.
* Keep classes organized and sorted alphabetically.
* Test changes thoroughly before committing.
* Provide clear commit messages and PR descriptions.

## File Structure

* `src/css/`: Source CSS files, organized by category.
* `dist/`: Compiled CSS library.
* `test.html`: Test file for new classes.

