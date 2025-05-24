import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL of the website
const BASE_URL = 'https://backlinkbot.ai';

// Function to get routes from the routes in App.tsx
function getRoutesFromApp() {
  try {
    const appTsxPath = path.join(__dirname, '../src/App.tsx');
    const appTsx = fs.readFileSync(appTsxPath, 'utf8');
    
    // Extract route paths using regex
    const routeRegex = /<Route\s+path="([^"]+)"/g;
    const routes = [];
    let match;
    
    while ((match = routeRegex.exec(appTsx)) !== null) {
      const route = match[1];
      // Skip routes with params and wildcards
      if (!route.includes(':') && route !== '*') {
        routes.push(route);
      }
    }
    
    return routes;
  } catch (error) {
    console.error('Error reading App.tsx:', error);
    return [];
  }
}

// Function to discover blog post IDs from various sources
function discoverBlogPosts() {
  const blogPostRoutes = [];
  const addedSlugs = new Set(); // Track added slugs to avoid duplicates
  
  // First, try to read from the blog index.json file
  try {
    const blogIndexPath = path.join(__dirname, '../public/content/blog/index.json');
    if (fs.existsSync(blogIndexPath)) {
      const blogIndexContent = fs.readFileSync(blogIndexPath, 'utf8');
      const blogPosts = JSON.parse(blogIndexContent);
      
      if (Array.isArray(blogPosts)) {
        console.log(`Found ${blogPosts.length} blog posts in index.json`);
        
        blogPosts.forEach(post => {
          if (post.slug) {
            const blogPath = `/blog/${post.slug}`;
            blogPostRoutes.push(blogPath);
            addedSlugs.add(post.slug);
          } else if (post.title) {
            // Generate a slug from the title if missing
            const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const blogPath = `/blog/${slug}`;
            blogPostRoutes.push(blogPath);
            addedSlugs.add(slug);
            console.log(`Generated slug from title for: ${post.title} -> ${slug}`);
          }
        });
      }
    } else {
      console.log('Blog index.json not found, falling back to file scanning');
    }
  } catch (error) {
    console.error('Error reading blog index.json:', error);
  }
  
  // Also scan the blog content directory for markdown files to ensure we get all posts
  try {
    const blogContentDir = path.join(__dirname, '../public/content/blog');
    if (fs.existsSync(blogContentDir)) {
      const files = fs.readdirSync(blogContentDir);
      
      // Look for markdown files that define blog posts
      const mdFiles = files.filter(file => file.endsWith('.md') && !file.includes('README') && file !== 'index.json');
      console.log(`Found ${mdFiles.length} markdown files in content/blog directory`);
      
      let newSlugsCount = 0;
      mdFiles.forEach(file => {
        // Extract slug from filename (format: YYYY-MM-DD-slug.md or slug.md)
        const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
        const simpleMatch = file.match(/^(.+)\.md$/);
        
        let slug;
        if (dateMatch && dateMatch[2]) {
          slug = dateMatch[2];
        } else if (simpleMatch && simpleMatch[1]) {
          slug = simpleMatch[1];
        }
        
        if (slug && !addedSlugs.has(slug)) {
          const blogPath = `/blog/${slug}`;
          blogPostRoutes.push(blogPath);
          addedSlugs.add(slug);
          newSlugsCount++;
        }
      });
      
      console.log(`Added ${newSlugsCount} additional blog posts from markdown files`);
    }
  } catch (error) {
    console.error('Error scanning blog content directory:', error);
  }
  
  console.log(`Total unique blog posts found: ${blogPostRoutes.length}`);
  return blogPostRoutes;
}

// Function to discover tool routes from components and data files
function discoverToolRoutes() {
  const toolRoutes = [];
  
  // Get tools from directory structure
  try {
    const toolsDir = path.join(__dirname, '../src/tools');
    if (fs.existsSync(toolsDir)) {
      const files = fs.readdirSync(toolsDir);
      
      // Look for .tsx files that define tools
      files
        .filter(file => file.endsWith('.tsx') && !file.includes('components'))
        .forEach(file => {
          // Convert the filename to a route (e.g., BusinessIdeaGenerator.tsx -> business-idea-generator)
          const toolName = file.replace('.tsx', '');
          const kebabCase = toolName
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase();
          
          const toolRoute = `/tools/${kebabCase}`;
          if (!toolRoutes.includes(toolRoute)) {
            toolRoutes.push(toolRoute);
          }
        });
    }
  } catch (error) {
    console.error('Error discovering tool routes from components:', error);
  }
  
  // Check data directory for potential tool data files
  try {
    // Possible locations for tool data
    const dataDirectories = [
      path.join(__dirname, '../src/data'),
      path.join(__dirname, '../public/data'),
      path.join(__dirname, '../data')
    ];
    
    for (const dataDir of dataDirectories) {
      if (fs.existsSync(dataDir)) {
        const files = fs.readdirSync(dataDir);
        
        for (const file of files) {
          if (file.toLowerCase().includes('tool') && file.endsWith('.json')) {
            const filePath = path.join(dataDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            try {
              const toolData = JSON.parse(content);
              if (Array.isArray(toolData)) {
                toolData.forEach(tool => {
                  if (tool.slug || tool.id || tool.path) {
                    const toolSlug = tool.slug || tool.id || tool.path;
                    const toolRoute = `/tools/${toolSlug}`;
                    if (!toolRoutes.includes(toolRoute)) {
                      toolRoutes.push(toolRoute);
                    }
                  }
                });
              }
            } catch (e) {
              console.error(`Error parsing ${file}:`, e);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error discovering tool routes from data files:', error);
  }
  
  return toolRoutes;
}

// Generate sitemap XML
async function generateSitemap() {
  console.log('Generating sitemap with blog posts...');
  
  try {
    // Read the existing sitemap.xml
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    console.log('Reading sitemap from:', sitemapPath);
    
    if (!fs.existsSync(sitemapPath)) {
      throw new Error('Sitemap file not found');
    }
    
    let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Read blog posts
    const blogDataPath = path.join(__dirname, '../public/content/blog/index.json');
    console.log('Reading blog data from:', blogDataPath);
    
    if (!fs.existsSync(blogDataPath)) {
      throw new Error('Blog index file not found');
    }
    
    const blogPosts = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    console.log(`Found ${blogPosts.length} blog posts`);
    
    // Generate blog entries
    const blogSitemapEntries = blogPosts.map(post => {
      const slug = post.slug || post.title.toLowerCase().replace(/\s+/g, '-');
      const lastmod = post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      
      return `  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }).join('\n');
    
    // Update sitemap
    const updatedSitemap = sitemapContent.replace(
      /  <!-- Blog posts -->\n/,
      `  <!-- Blog posts -->\n${blogSitemapEntries}\n`
    );
    
    // Write updated sitemap
    fs.writeFileSync(sitemapPath, updatedSitemap, 'utf8');
    console.log('✅ Successfully updated sitemap.xml');
    
    // Verify the update
    const finalSitemap = fs.readFileSync(sitemapPath, 'utf8');
    const blogEntryCount = (finalSitemap.match(/<loc>https:\/\/backlinkbot\.ai\/blog\//g) || []).length;
    console.log(`Verified ${blogEntryCount} blog entries in final sitemap`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Function to check and update robots.txt
function updateRobotsTxt() {
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  let robotsContent = '';
  
  // Check if robots.txt exists
  if (fs.existsSync(robotsPath)) {
    robotsContent = fs.readFileSync(robotsPath, 'utf8');
  } else {
    // Create a basic robots.txt
    robotsContent = 'User-agent: *\nAllow: /\n';
  }
  
  // Check if Sitemap is already in robots.txt
  if (!robotsContent.includes('Sitemap:')) {
    robotsContent += `\nSitemap: ${BASE_URL}/sitemap.xml\n`;
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('Updated robots.txt with sitemap reference');
  }
  
  // Copy robots.txt to dist directory as well
  const distDir = path.join(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    fs.ensureDirSync(distDir);
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent);
    console.log(`Also copied robots.txt to dist directory`);
  }
}

// Execute the sitemap generation and robots.txt update
generateSitemap();
updateRobotsTxt(); 