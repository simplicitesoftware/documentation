# Simplicité Documentation

## Installation

```
$ npm install
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Creating New Documentation

1. Create a new markdown file (`.md` or `.mdx`) in the appropriate directory under `docs/`.
2. For images:
   - Create an `/img/document-name` directory in the same folder as your document
   - Place related images in this directory
   - Reference images using relative paths: `![Alt text](./img/document-name/image-name.png)`

## Deployment

The documentation is automatically deployed when changes are pushed to the master branch. GitHub Actions will:
1. Build the documentation
2. Deploy the updated content to GitHub Pages
3. Make it available at the public URL

No manual deployment steps are required - just push your changes to master.

> Build will fail if broken links / anchors are detected
