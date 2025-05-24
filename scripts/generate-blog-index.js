import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing blog posts
const BLOG_DIR = path.join(__dirname, '..', 'content', 'blog');
// Output directory for the index file
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'content', 'blog');

// Create the output directory if it doesn't exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Read all markdown files from the blog directory
const blogFiles = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));

// Process each file and extract front matter
const posts = blogFiles.map(filename => {
  const filePath = path.join(BLOG_DIR, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContent);
  
  // Generate slug from filename (remove date and .md extension)
  const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
  
  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
    author: data.author,
    tags: data.tags,
    thumbnail: data.thumbnail
  };
});

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write the index file
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'index.json'),
  JSON.stringify(posts, null, 2)
);

console.log(`Generated index.json with ${posts.length} posts`); 