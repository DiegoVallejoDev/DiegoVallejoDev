const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { marked } = require('marked');
const fm = require('front-matter');

// Paths
const BLOG_ENTRIES_DIR = path.join(__dirname, '../src/blog/entries');
const BLOG_INDEX_PATH = path.join(__dirname, '../src/blog/index.html');
const BLOG_TEMPLATE_PATH = path.join(__dirname, '../src/blog/template.html');

// Helper function to extract metadata from HTML files
function extractHtmlMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract title
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(' - Diego Vallejo', '').trim() : 'Untitled';
    
    // Extract description
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const description = descMatch ? descMatch[1] : '';
    
    // Extract date from time element
    const dateMatch = content.match(/<time\s+datetime=["'](.*?)["']/i);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
    
    // Extract author from address
    const authorMatch = content.match(/<address>Por\s+<a[^>]*>(.*?)<\/a><\/address>/i);
    const author = authorMatch ? authorMatch[1] : 'Diego Vallejo';
    
    return { title, description, date, author };
}

// Helper function to format date in Spanish
function formatDateSpanish(dateString) {
    const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    // Handle both ISO date strings and Date objects
    let date;
    if (typeof dateString === 'string') {
        // Parse YYYY-MM-DD format
        const parts = dateString.split('-');
        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else {
        date = new Date(dateString);
    }
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} de ${month} de ${year}`;
}

// Helper function to create slug from filename
function createSlug(filename) {
    return path.basename(filename, path.extname(filename));
}

// Process markdown file and convert to HTML
function processMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { attributes, body } = fm(content);
    
    // Convert markdown to HTML
    const htmlContent = marked(body);
    
    // Read template
    const template = fs.readFileSync(BLOG_TEMPLATE_PATH, 'utf-8');
    
    // Create slug
    const slug = createSlug(filePath);
    
    // Replace placeholders in template
    let output = template
        .replace(/{{TITLE}}/g, attributes.title || 'Untitled')
        .replace(/{{DESCRIPTION}}/g, attributes.description || '')
        .replace(/{{AUTHOR}}/g, attributes.author || 'Diego Vallejo')
        .replace(/{{DATE}}/g, attributes.date || new Date().toISOString().split('T')[0])
        .replace(/{{DATE_FORMATTED}}/g, formatDateSpanish(attributes.date || new Date().toISOString().split('T')[0]))
        .replace(/{{SLUG}}/g, slug)
        .replace(/{{CONTENT}}/g, htmlContent);
    
    // Write HTML file
    const outputPath = path.join(BLOG_ENTRIES_DIR, `${slug}.html`);
    fs.writeFileSync(outputPath, output);
    
    console.log(`✓ Converted ${path.basename(filePath)} to HTML`);
    
    return {
        title: attributes.title || 'Untitled',
        description: attributes.description || '',
        date: attributes.date || new Date().toISOString().split('T')[0],
        author: attributes.author || 'Diego Vallejo',
        slug: slug
    };
}

// Generate blog index
function generateBlogIndex(entries) {
    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate entry cards HTML
    const entriesHtml = entries.map(entry => {
        // Ensure date is in YYYY-MM-DD format
        const dateStr = typeof entry.date === 'string' ? entry.date : entry.date.toISOString().split('T')[0];
        
        return `
        <div class="blog-entry">
            <h2><a href="entries/${entry.slug}.html">${entry.title}</a></h2>
            <div class="blog-entry-meta">
                <time datetime="${dateStr}">${formatDateSpanish(entry.date)}</time>
                <span>•</span>
                <span>${entry.author}</span>
            </div>
            <p class="blog-entry-description">${entry.description}</p>
        </div>
    `;
    }).join('');
    
    // Create blog index HTML
    const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Blog de Diego Vallejo - Reflexiones sobre tecnología, desarrollo web, filosofía digital y más.">
    <meta name="author" content="Diego Vallejo">
    <link rel="canonical" href="https://diegovallejo.dev/blog/">
    <title>Blog - Diego Vallejo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <button class="theme-toggle" id="themeToggle" aria-label="Cambiar tema">
        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    </button>

    <nav class="blog-nav">
        <a href="/">← Inicio</a>
    </nav>

    <div class="blog-index">
        <h1>📝 Blog</h1>
        <div class="blog-entries">
            ${entriesHtml}
        </div>
    </div>

    <script>
        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Check for saved theme preference or default to 'light' mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', function() {
            const theme = html.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    </script>
</body>
</html>`;
    
    fs.writeFileSync(BLOG_INDEX_PATH, indexHtml);
    console.log('✓ Generated blog index');
}

// Main build function
async function buildBlog() {
    console.log('🔨 Building blog...\n');
    
    const entries = [];
    const processedSlugs = new Set();
    
    // Find all markdown files
    const mdFiles = await glob('*.md', { cwd: BLOG_ENTRIES_DIR });
    
    // Convert markdown files to HTML
    for (const file of mdFiles) {
        const filePath = path.join(BLOG_ENTRIES_DIR, file);
        const metadata = processMarkdownFile(filePath);
        entries.push(metadata);
        processedSlugs.add(metadata.slug);
    }
    
    // Find all existing HTML files (excluding converted ones from markdown)
    const htmlFiles = await glob('*.html', { cwd: BLOG_ENTRIES_DIR });
    
    // Extract metadata from HTML files (skip if it was converted from markdown)
    for (const file of htmlFiles) {
        const slug = createSlug(file);
        if (!processedSlugs.has(slug)) {
            const filePath = path.join(BLOG_ENTRIES_DIR, file);
            const metadata = extractHtmlMetadata(filePath);
            metadata.slug = slug;
            entries.push(metadata);
        }
    }
    
    // Generate blog index
    generateBlogIndex(entries);
    
    console.log(`\n✨ Blog build complete! Processed ${entries.length} entries.`);
}

// Run the build
buildBlog().catch(error => {
    console.error('❌ Error building blog:', error);
    process.exit(1);
});
