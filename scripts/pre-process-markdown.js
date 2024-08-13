const fs = require('fs');
const path = require('path');

function main() {
  const files = fs.readdirSync('src/markdowns', 'utf8');
  const markdownContent = files.filter((file) => file.endsWith('.md'));

  const content = markdownContent.map((file) => {
    const content = fs.readFileSync(path.join(__dirname, '../src/markdowns', file), 'utf8');
    return `# ${file.replace('.md', '').replace(/\d+\./, '')}\n\n${content}`;
  });

  fs.writeFileSync('public/markdownFiles.json', JSON.stringify(content, null, 2));
}

main();
