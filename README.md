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

## Deployment

The documentation is automatically deployed when changes are pushed to the master branch. GitHub Actions will:
1. Build the documentation
2. Deploy the updated content to GitHub Pages
3. Make it available at the public URL

No manual deployment steps are required - just push your changes to master.

⚠ Build will fail if broken links / anchors are detected

## Creating New Documentation

1. Create a new markdown file (`.md` or `.mdx`) in the appropriate directory under `docs/`.
2. For images:
   - Create an `/img/document-name` directory in the same folder as your document
   - Place related images in this directory
   - Reference images using relative paths: `![Alt text](./img/document-name/image-name.png)`

### Documentation metadata 

Markdown documents can use the following Markdown [front matter](https://docusaurus.io/docs/markdown-features#front-matter) metadata fields, enclosed by a line --- on either side.

Example : 
```
---
id: doc-markdown
title: Docs Markdown Features
hide_title: false
hide_table_of_contents: false
sidebar_label: Markdown
sidebar_position: 3
pagination_label: Markdown features
custom_edit_url: https://github.com/facebook/docusaurus/edit/main/docs/api-doc-markdown.md
description: How do I find you when I cannot solve this problem
keywords:
  - docs
  - docusaurus
tags: [docusaurus]
image: https://i.imgur.com/mErPwqL.png
slug: /myDoc
last_update:
  date: 1/1/2000
  author: custom author name
---
```

### Code blocks

You can add a `title` to the code block by adding a title key after the language (leave a space between them).
```js
console.log('What a great log');
```

### Code block tabs

To use [code block tabs](https://docusaurus.io/docs/markdown-features/code-blocks#multi-language-support-code-blocks) that make some documentation more readable, use a `.mdx` file format and use the following syntax (put the import instructions before your first use of the tabs, or right **after** the front matter headings)

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="tab1" label="Tab1">



</TabItem>
<TabItem value="tab2" label="Tb2">



</TabItem>
</Tabs>
```

### Custom title ids : 

The following syntax will allow a link to `[text](/url#my-explicit-id)` instead of the default `[text](/url#hello-world)`
````
### Hello World {#my-explicit-id}
```

### Admonitions

In addition to the basic Markdown syntax, we have a special admonitions syntax by wrapping text with a set of 3 colons, followed by a label denoting its type. 

See [Admonitions how-to](https://docusaurus.io/docs/markdown-features/admonitions)


### See more

https://docusaurus.io/docs/category/guides