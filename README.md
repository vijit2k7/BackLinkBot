# Welcome to your BacklinkBot Website 

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/28fab30c-ad52-47dc-a2cd-b58ce532d2bf) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Sitemap Generation

The website uses an automatic sitemap generator that runs during the build process. This ensures that all pages, including new blog posts and tools, are automatically added to the sitemap.xml file.

### How it works

1. The sitemap generator script (`scripts/generate-sitemap.js`) runs automatically before each build
2. It scans the application code to discover:
   - Static routes from App.tsx
   - Blog posts from Blog.tsx and BlogPost.tsx
   - Tool pages from the tools directory
   - Any JSON data files that might contain additional blogs or tools

3. The script generates a sitemap.xml file with proper priority and changefreq values
4. The sitemap is placed in both the public/ and dist/ directories
5. The robots.txt file is updated to include a reference to the sitemap

### Adding new content

When adding new content to the site:

- **New blog posts:** These will be automatically detected and added to the sitemap during the next build
- **New tools:** These will be automatically detected and added to the sitemap during the next build
- **New static pages:** These will be automatically detected if they are added as routes in App.tsx

No manual sitemap updates are required - everything happens automatically during the build process.

### Testing sitemap generation

To manually generate the sitemap:

```bash
npm run generate-sitemap
```

This will create/update the sitemap.xml and robots.txt files.
