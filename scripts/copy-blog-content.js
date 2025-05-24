import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination directories
const sourceDir = path.join(path.dirname(__dirname), 'content/blog');
const destDir = path.join(path.dirname(__dirname), 'public/content/blog');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all markdown files
const files = fs.readdirSync(sourceDir);
const posts = [];

files.forEach(file => {
  if (file.endsWith('.md')) {
    try {
      // Read the file content
      const content = fs.readFileSync(path.join(sourceDir, file), 'utf8');
      
      // Extract frontmatter
      const frontmatterMatch = content.match(/---([\s\S]*?)---/);
      if (!frontmatterMatch) {
        console.warn(`Warning: No frontmatter found in ${file}`);
        return;
      }
      
      const frontmatter = frontmatterMatch[1];
      
      // Extract metadata
      const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);
      const dateMatch = frontmatter.match(/date:\s*(.+)/);
      const authorMatch = frontmatter.match(/author:\s*(.+)/);
      const thumbnailMatch = frontmatter.match(/thumbnail:\s*(.+)/);
      const summaryMatch = frontmatter.match(/summary:\s*([^]*?)(?=\n\w|$)/m);
      const tagsMatch = frontmatter.match(/tags:\s*\n((\s*-\s*.+\n?)+)/);
      
      if (!dateMatch) {
        console.warn(`Warning: No date found in ${file}`);
        return;
      }

      // Format the date consistently
      const date = new Date(dateMatch[1].trim()).toISOString();
      const formattedDate = date.split('T')[0];
      
      // Get slug from filename (remove date and .md)
      const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      
      // Create new filename with consistent date format
      const newFilename = `${formattedDate}-${slug}.md`;
      
      // Copy the file with the new name
      fs.copyFileSync(
        path.join(sourceDir, file),
        path.join(destDir, newFilename)
      );
      
      const tags = tagsMatch 
        ? tagsMatch[1]
            .split('\n')
            .filter(line => line.trim())
            .map(tag => tag.replace(/^\s*-\s*/, '').trim())
            .filter(tag => tag !== '""' && tag !== "''")
        : [];
      
      posts.push({
        slug,
        title: titleMatch ? titleMatch[1].trim() : '',
        date,
        author: authorMatch ? authorMatch[1].trim() : 'Backlink Bot Team',
        tags,
        thumbnail: thumbnailMatch ? thumbnailMatch[1].trim() : undefined,
        summary: summaryMatch ? summaryMatch[1].trim() : ''
      });
      
      console.log(`Processed: ${newFilename}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
});

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Write index.json
fs.writeFileSync(
  path.join(destDir, 'index.json'),
  JSON.stringify(posts, null, 2)
);

console.log(`Copied ${files.length} files and generated index.json`); 