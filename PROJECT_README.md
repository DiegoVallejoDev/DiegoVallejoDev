# DiegoVallejo.dev - Personal Website & Blog

Personal website and blog for Diego Vallejo, built with Parcel and featuring automatic blog generation from HTML and Markdown files.

## 🚀 Features

- **Parcel Build System**: Fast, zero-config bundler with automatic optimization
- **Blog System**: Automatic index generation with markdown support
- **Theme Toggle**: Light/dark mode with localStorage persistence
- **Responsive Design**: Mobile-friendly layout with academic typography
- **Optimized Output**: Automatic compression (gzip/brotli), image optimization
- **Markdown Support**: Write blog posts in markdown with frontmatter metadata

## 📁 Project Structure

```
DiegoVallejoDev/
├── src/
│   ├── index.html              # Main site entry
│   └── blog/
│       ├── index.html          # Auto-generated blog index
│       ├── template.html       # Blog post template
│       ├── style.css           # Blog styles
│       └── entries/
│           ├── *.html          # HTML blog posts
│           └── *.md            # Markdown blog posts
├── scripts/
│   └── build-blog.js           # Blog generation script
├── static/                     # Static files (copied to dist)
├── dist/                       # Production build output
└── package.json
```

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Development Server

Start the development server with hot reload:

```bash
npm start
```

The site will be available at `http://localhost:1234`

### Production Build

Build the site for production:

```bash
npm run build
```

Output will be in the `dist/` directory.

### Clean Build

Remove build artifacts:

```bash
npm run clean
```

## 📝 Writing Blog Posts

### Markdown Posts

Create a new `.md` file in `src/blog/entries/`:

```markdown
---
title: "Your Post Title"
description: "A brief description"
date: 2025-01-15
author: Diego Vallejo
---

# Your Post Title

Your content here...
```

### HTML Posts

Create a new `.html` file in `src/blog/entries/` with the blog template structure, or the build script will extract metadata from standard HTML tags.

### Metadata Extraction

The build script automatically extracts:
- **From Markdown**: Frontmatter (title, description, date, author)
- **From HTML**: `<title>`, `<meta name="description">`, `<time datetime="">`, `<address>`

### Building

Run the build script to generate the blog index and convert markdown to HTML:

```bash
node scripts/build-blog.js
```

Or just run the normal build (which includes the blog build):

```bash
npm run build
```

## 🎨 Styling

The blog uses:
- **Fonts**: Lora (serif) for article content, Inter (sans-serif) for UI
- **Theme**: CSS custom properties for light/dark modes
- **Colors**: Academic color scheme with accent colors
- **Typography**: Responsive font sizes with optimal line height

## 🔧 Configuration

### Parcel Configuration (`.parcelrc`)

- Image optimization for jpg, png, gif
- Gzip and Brotli compression
- Static files copy from `static/` directory

### Build Script

The `scripts/build-blog.js` script:
1. Scans `src/blog/entries/` for `.html` and `.md` files
2. Converts markdown to HTML using the template
3. Extracts metadata from all entries
4. Generates `src/blog/index.html` with sorted entries (newest first)

## 📦 Dependencies

### Production
- **marked**: Markdown parser
- **front-matter**: Frontmatter parser for markdown
- **glob**: File pattern matching

### Development
- **parcel**: Build tool and bundler
- **@parcel/\***: Parcel plugins for optimization and compression

## 🔒 Security

### Known Issues

- **Parcel dev-server**: Contains a moderate severity Origin Validation Error vulnerability (CVE-2025-56648). This only affects the development server and does not impact production builds.

### Mitigations

- Development server vulnerability is not present in production builds
- All production dependencies are regularly audited
- glob package updated to 11.1.0 to fix CLI command injection vulnerability

## 📄 License

MIT

## 👤 Author

**Diego Vallejo**
- Website: [diegovallejo.dev](https://diegovallejo.dev)
- GitHub: [@DiegoVallejoDev](https://github.com/DiegoVallejoDev)
- LinkedIn: [diego-vallejo](https://www.linkedin.com/in/diego-vallejo/)

## 🙏 Acknowledgments

- Typography inspired by academic publishing
- Blog system design influenced by modern static site generators
- Theme toggle implementation adapted from web accessibility best practices
