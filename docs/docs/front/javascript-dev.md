---
sidebar_position: 30
title: Javascript Development
---

Javascript Development
======================

:::warning
This documentation is part of the **Frontend Development** category, designed to guide you through frontend customization within Simplicité.
:::

This guide covers JavaScript usage in Simplicité for custom interactions and external objects.

:::tip Quick Tips
- Align customizations with Simplicité's best practices for compatibility
- Keep JavaScript modular and maintainable
- Check if Simplicité's native features can achieve your goal before writing custom code
:::

JavaScript in Simplicité serves two main scenarios:

1. **Custom Application**: Connect to Simplicité using the NPM Library
2. **Custom Elements**: Create widgets/pages integrated via External Objects

# NPM Library

The [Simplicité NPM library](https://www.npmjs.com/package/simplicite) provides a JavaScript API for both frontend and backend contexts.

## Basic Usage

```javascript
import simplicite from 'simplicite';

const app = simplicite.session({ url: '<instance URL>' });

try {
  const user = await app.login({ 
    username: '<username>', 
    password: '<password>' 
  });
  console.log('Hello ' + user.login + '!');
  
  const obj = app.getBusinessObject('MyObject');
  const list = await obj.search();
  // Work with results
} catch (err) {
  console.error(err.message);
}
```

## Key Features

- **Authentication**: Manage user sessions programmatically
- **Object Handling**: CRUD operations on Business Objects
- **Ajax Calls**: Communicate with Simplicité's backend
- **Utilities**: Helper methods for logging and debugging

## Project Setup

1. Create project directory and initialize:
```bash
npm init -y
npm install simplicite express
```

2. Create directory structure:
```
CustomFront/
  public/
    style.css
  views/
    index.html
  app.js
  package.json
```

## Example: Product Display

### Simplicité Configuration

```javascript
import dotenv from 'dotenv';
dotenv.config();

const app = simplicite.session({
    url: process.env.SIMPLICITE_URL || '<instance URL>',
    username: process.env.SIMPLICITE_USERNAME || '<username>',
    password: process.env.SIMPLICITE_PASSWORD || '<password>',
    debug: false
});
```

### Express Server Setup

```javascript
const args = process.argv.slice(2);
const serverHost = process.env.VCAP_APP_HOST || args[0] || 'localhost';
const serverPort = process.env.VCAP_APP_PORT || parseInt(args[1]) || 3000;

const server = express();
server.disable('x-powered-by');
const dir = dirname(fileURLToPath(import.meta.url));
server.use(express.static(dir + '/public'));
```

### Fetch Business Object Data

```javascript
const products = app.getBusinessObject('DemoProduct');
const productList = await products.search(null, { 
  inlineDocuments: ['demoPrdPicture'] 
});
```

### Render Views

```javascript
server.get('/', async (req, res) => {
  headers(res);
  res.sendFile(`${dir}/views/index.html`);
});

server.get('/products', async (req, res) => {
  headers(res);
  try {
    const prdList = await products.search(null, { 
      inlineDocuments: ['demoPrdPicture'] 
    });
    res.json(prdList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Client-Side Fetch

```javascript
fetch('/products')
  .then(response => response.json())
  .then(products => {
    const list = document.getElementById('product-list');
    products.forEach(prd => {
      const item = document.createElement('li');
      const imageSrc = `data:${prd.demoPrdPicture.mime};base64,${prd.demoPrdPicture.content}`;
      item.innerHTML = `
        <img src="${imageSrc}" alt="${prd.demoPrdName}">
        <h3>${prd.demoPrdName}</h3>
        <p>${prd.demoPrdDescription}</p>
      `;
      list.appendChild(item);
    });
  });
```

## Demo Repositories

Explore examples for different environments:

- **Basic**: [Main repository tests](https://github.com/simplicitesoftware/javascript-api)
- **Server-side**: [Node.js demo](https://github.com/simplicitesoftware/nodejs-demo)
- **Plain web**: [HTML/JS demo](https://github.com/simplicitesoftware/web-demo)
- **Vue.js**: [Vue demo](https://github.com/simplicitesoftware/vue-demo)
- **React**: [React demo](https://github.com/simplicitesoftware/react-demo)
- **Angular**: [Angular demo](https://github.com/simplicitesoftware/angular-demo)
- **React Native**: [Mobile demo](https://github.com/simplicitesoftware/react-native-demo)
- **Within Simplicité**: [Demo module](https://github.com/simplicitesoftware/module-demo-jslib)

# Core Javascript Usage

## External Objects (Embedded Widgets)

JavaScript in External Objects enables custom behaviors and Simplicité communication.

**Example**: Display product list with name and price

```javascript
let app = $ui.getApp();
let prdList = app.getBusinessObject("DemoProduct");

products.search(function(){
  for (let i=0; i<products.list.length; i++) {
    const prd = products.list[i];
    document.getElementById("widget-productlist").insertAdjacentHTML(
      'beforeend',
      `<div class="widget-product">
        <span>${prd.demoPrdName}</span>
        <span>${prd.demoPrdUnitPrice}</span>
      </div>`
    );
  }
}, null, {});
```

## External Pages

For standalone pages, use this structure:

### JavaScript (Client-Side)

```javascript
var MyExternalPage = (function($) {
  function render(params) {
    app = new Simplicite.Ajax("", "uipublic");
    // Your logic here
  }
  return { render: render };
})(jQuery);
```

### Java (Server-Side)

```java
public class MyExternalObject extends ExternalObject {
  @Override
  public Object display(Parameters params) {
    try {
      setDecoration(false);
      BootstrapWebPage wp = new BootstrapWebPage(params.getRoot(), getDisplay());
      
      wp.appendAjax();
      wp.appendJSInclude(HTMLTool.getResourceJSURL(this, "CLASS"));
      wp.appendCSSInclude(HTMLTool.getResourceCSSURL(this, "STYLES"));
      wp.appendHTML(HTMLTool.getResourceHTMLContent(this, "HTML"));
      
      wp.setReady(this.getName() + ".render({});");
      return wp.toString();
    } catch (Exception e) {
      AppLog.error(getClass(), "display", null, e, getGrant());
      return e.getMessage();
    }
  }
}
```

:::warning
Avoid overusing JavaScript when Simplicité's native features (Business Logic, Declarative Rules, Object Hooks) can achieve the same results. This maintains compatibility and simplifies maintenance.
:::