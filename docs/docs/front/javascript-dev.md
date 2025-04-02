---
sidebar_position: 30
title: Javascript Development
---

Javascript Development
======================

<div class="warning">
    This lesson is a part of the <b>Frontend Development</b> category, which is meant to guide you through the frontend development within Simplicité. Thus it might be a bit longer and more verbosed than other lessons you will find in the <b>Simplicité Configuration Object</b> category.
</div>

This document presents the base & guidelines to javascript development within Simplicité. As the main use for it is the implementation of specific interactions for different external objects. Here we will provide an understanding of how javascript codes are handled within Simplicité, giving some guidelines for your developments and tips on how to work with javascript for your external objects.

> **Quick Tips:**
> - Always align your customizations with Simplicité's documented best practices to ensure compatibility and upgradability. Keep your JavaScript code modular and maintainable, making it easier for future developers to adapt or debug.
> - Before delving into javascript development, make sure the specific behaviors and possible features you want to implement within your Simplicité application don't have a possible implementation with Simplicité's features !

In Simplicité application development, Javascript plays a key role in two main scenarios:

1) **Building a Custom Application:** Such application connects to a Simplicité instance using the *NPM Simplicité Library* from a custom and standalone front.
2) **Creating Custom Elements:** It is possible to create & customize elements (widgets, webpages) that are integrated directly into a Simplicité application through the *External Objects*.

This lesson will cover both approaches. The section on **1)** will thus provide an in-depth, hands-on guide, while the section **2)** will be more concise, as the topic is thoroughly covered in the [UI Component](/docs/front/ui-component) lesson.

# NPM Library

Simplicité NPM library serves as a bridge to integrate JavaScript functionalities into Simplicité applications, both in front-end & back-end contexts. By default it is installed for everything within your instances and applications. [Here](https://www.npmjs.com/package/simplicite) you will find the node.js® & browser JavaScript API client module for the Simplicité® platform.

The basic usage for the *JavaScript API client module* is the following:

```javascript
import simplicite from 'simplicite';

const app = simplicite.session({ url: '<my instance base URL>' });

try {
  const user = await app.login({ username: '<my username>', password: '<my password>' });
	console.log('Hello ' + user.login + '!');
	const obj = app.getBusinessObject('MyObject');
	const list = await obj.search();
	// Do something with the search results list
} catch (err) {
  console.error(err.message);
}
```

It provides several APIs for:
- **Authentication** to manage user session programmatically.
- **Object Handling**, performing *CRUD* operations (or other manipulations) on Business Objects.
- **Ajax Call** to communicate with Simplicité's back-end in order to fetch data or invoke specific logic.
- **Utilities** in order to acess helper methods for logging, debugging, etc.

***Example:*** Fetching a Business Object
```javascript
const simplicite = require('simplicite');
const session = simplicite.session({ url: 'https://your-instance.simplicite.io', username: 'admin', password: 'password' });

session.login()
  .then(() => session.getBusinessObject('MyObject').search())
  .then(data => console.log('Business object data:', data))
  .catch(err => console.error('Error:', err));
```

## Step-by-Step Example

We'll provide a simple example of a *web app front-end* connected to *Simplicité's backend*. The goal is to demonstrate how to use the **NPM library** in a practical scenario, breaking down the process to give a clearer and more comprehensive understanding of its implementation.

To get started with building a custom Simplicité front-end using the NPM library, the essential script to keep in mind is as follows:

```javascript
import simplicite from 'simplicite';

const app = simplicite.session({ url: '<my instance base URL>' });

try
{
	const user = await app.login({ username: '<my username>', password: '<my password>' });
	console.log('Hello ' + user.login + '!');

	// Do whatever you want within your app/session
}
catch (err) console.error(err.message);
```

The rest of this example is focusing on a Native based web-page using basic web technologies: **HTML**, **CSS**, **JS**.

### Basic Setup

The first step to create your custom front with the NPM Simplicite library is the same as for most of other **Node.js** projects:

1) First create a new directory **CustomNativeFront**, in which you will run the `npm init -y` command from terminal

2) Then you'll need to install the *simplicite* and *express* packages using the `npm install simplicite express`

### Directory Structure

Once the basic setup for your Simplicité-powered project is installed, the next step is to *structure it* like any standard web project using **Node.js**. This typically results in the following file structure:

CustomNativeFront/
&nbsp;&nbsp;&nbsp;&nbsp;public/
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;style.css
&nbsp;&nbsp;&nbsp;&nbsp;views/
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index.html
&nbsp;&nbsp;&nbsp;&nbsp;app.js
&nbsp;&nbsp;&nbsp;&nbsp;package.json


- Place all *dynamically accessed* resources, such as stylesheets and scripts for specific pages, in the **public** folder (for now, this may only include `index.html`).
- Store all your `.html` files representing *individual pages* in the **views** folder.
- Your main javascript code (for project's setting up at least) will be written in the `app.js` file.

> ***Note:*** Properly setting up and understanding why your project directory is organized this way is important to later properly implement your javascript code and ensure consistency throughout your project if you want to scale it.

### Javascript Code

Now that you have created all the needed files and directories inside your peoject's folder, you are ready to start implementing your main script located at **app.js** within the root of your project's folder.

***Imports -*** The starting point of your `app.js` is first, the needed bunch of imports:

```javascript
'use strict';

import simplicite from 'simplicite';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import dotenv from 'dotenv';
```
<details>
<summary>Code Details</summary>

- `'use strict'` sets the **strict mode** for your script, enforcing *stricter parsing* and error handling in JavaScript, helping catch common coding mistakes and prevent unsafe actions.
- `import simplicite from 'simplicite';` and `import express from 'express';` are needed in our code to correctly *handle file paths* when serving static assets and views, especially when working with the *ES module* syntax in Node.js.
- `import dotenv from 'dotenv';` is used to load environment variables from a `.env` file, allowing *secure* and *flexible* management of *configuration settings* like *database URLs* or *API credentials*.
</details>

***Header Function -*** Responsible for setting HTTP response headers that control caching behavior for the client (here web-browser). These headers are used to ensure that the content is always fresh and not served from a cache, which is particularly important for applications that need to show real-time data.

```javascript
function headers(res)
{
	res.header('Cache-Control', 'private, no-cache, no-store, no-transform, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
}
```
<details>
<summary>Code Details</summary>

- `res.header('Cache-Control', 'private, no-cache, no-store, no-transform, must-revalidate');` sets the **Cache-Control** header, instructing client to not cache the response.
- `res.header('Expires', '-1');` sets the **Expires** header to '-1', indicating that the response is already expired and shouldn't be cached.
- `res.header('Pragma', 'no-cache');` sets the **Pragma** header to `no-cache`, a legacy HTTP directive to prevent caching.
</details>

We'll break down the creation of this script and outline all the essential elements to ensure the proper setup and functionality of your Simplicité-powered project.

#### Simplicite Setup

The next step is to configure your Simplicité instance to establish a proper connection with your front-end. You can achieve this by using the following code:

```javascript
dotenv.config();
const app = simplicite.session({
    url: process.env.SIMPLICITE_URL || '<your instance URL>',
    username: process.env.SIMPLICITE_USERNAME || '<your username>',
    password: process.env.SIMPLICITE_PASSWORD || '<your password>',
    debug: false
});
```
<details>
<summary>Code Details</summary>

- `url` defines the url for your Simplicité session, for most of the demos we use `https://demo.dev2.simplicite.io`.
- `username` sets the username to access the session, ensure this is a valid one.
- `password` sets the password to access the session, ensure it's the good one for your user and session.
- `debug` defines if yes or not your session is used in debug mode.
</details>

In the code, you’ll notice that your information can either be hardcoded with *string* values or secured by referencing a `.env` file created in your root directory. For this use case, the `.env` file might look like this:

```
SIMPLICITE_URL=https://demo.dev2.simplicite.io
SIMPLICITE_USERNAME=website
SIMPLICITE_PASSWORD=simplicite
```

Then those variable and values can be accessed using the *dotenv* module, to do so ensure you call the `dotenv.config()` method, thanks to which you can then access your environment variables within *app.js* using `process.env.<VARIABLE_NAME>`.

The rest of the **app.js** script shall be written within the following try/catch statement:
```javascript
try
{
  app.login()
    .then(async user => {
      // CODE SNIPPET HERE
    });
}
catch (err) app.log(err);
```

#### Express Server

Now, set up your Express server and configure its host parameters using the following code snippet or an equivalent method.

```javascript
const args = process.argv.slice(2);
const serverHost = process.env.VCAP_APP_HOST || args[0] || 'localhost';
const serverPort = process.env.VCAP_APP_PORT || parseInt(args[1]) || 3000;

const server = express();
server.disable('x-powered-by');
const dir = dirname(fileURLToPath(import.meta.url));
server.use(express.static(dir + '/public'));
```
<details>
<summary>Code Details</summary>

- `serverHost` and `serverPort` are instanciated either from your **.env** file, **command line arguments**, or **hardcoded values**, and defines the host *IP address* and *Port* where your app should run.
- `const server = express()` creates an express application instance, that will handle incoming HTTP requests and also manage routes & responses.
- `server.disable('x-powered-by');` disables the specified header in HTTP responses, included for security reasons as it prevents revealing that app is runing on express (supposed to make it less vulnerable).
- `const dir` stores the directory path for current module/file, converting the `import.meta.url` into a regular file path with `fileURLToPath()`, and extracting the directory part for this part using `dirname()`. It ensures the proper referencing of files relative to current **app.js** script.
- `server.use()` serves static files from `/public` directory, and can be accessed by visiting `/filename` in browser. It enables frontend assets (images, stylesheets, additional scripts, ...).
</details>

This section ensures the Express server is properly set up to *manage routing*, *handle HTTP requests*, and *serve the front-end*, while seamlessly connecting to Simplicité.

> ***Note:*** This method demonstrates a straightforward, native Node.js setup for integrating Express with Simplicité. While this is not the only approach—other frameworks, templating engines, and deployment strategies provide greater flexibility—this example prioritizes simplicity and clarity to help you get started quickly.

#### Simplicite Logic

The presented below approach aligns with *typical JavaScript development* within Simplicité solutions, particularly in **External Objects**, and demonstrates how to fetch Business Object data from the Simplicité backend using familiar methods and logic. The `app.js` and `index.js` scripts are detailed below.

**app.js** – This script functions as the *server-side* component, responsible for retrieving the *DemoProduct* business object from Simplicité's backend.
```javascript
const products = app.getBusinessObject('DemoProduct');

const productList = await products.search(null, { inlineDocuments: ['demoPrdPicture'] });
```

> The next code snippet isn't from app.js, but shows how to manipulate and display **Business Object** data dynamically from what we retrieved in the previous script.

***index.js;*** this code snippet is associated to your `index.html` file, and is only the display part that adds `li` elements to the `ul.product-list` html balise:
```javascript
products.forEach(prd => {
  const list = document.getElementById('product-list');
  const item = document.createElement('li');
    const imageSrc = `data:${prd.demoPrdPicture.mime};base64,${prd.demoPrdPicture.content}`;
    item.innerHTML = `
        ![](img/javascript-dev/imageSrc)
        <h3>${prd.demoPrdName}</h3>
        <p>${prd.demoPrdDescription}</p>
    `;
    list.appendChild(item);
});
```

These examples provide a clearer understanding of how to retrieve and dynamically display Business Object data from your Simplicité instance within your project’s front-end.

#### Router & Views rendering

With most of the setup complete, the next step is to link the *index.html* file to your project and *render it* through the *app.js* script. The following code snippet demonstrates a simple way to achieve this using *Express's router* and *HTML* files.

```javascript
server.get('/', async (req, res) => {
  headers(res);

  const indexPath = `${dir}/views/index.html`;
  res.sendFile(indexPath);
});
```
<details>
<summary>Code Details</summary>

- `server.get('\', function)` handles *HTTP GET* requests to the *'/'* root URL, and defines how the server responds to client requests at this route.
- `headers()` sets cache-related HTTP headers to prevent caching, ensures a fresh content is delivered to client.
- `res.sendFile()` sends the `index.html` file from the server's file system to the client, as a response.
</details>

> ***Note:*** Although `.html` files are commonly used for rendering, other formats can also be utilized to suit your content requirements.

The following snippet illustrates how to render `.pug` or `.ejs` files. To ensure proper functionality, make sure your directory and project are correctly configured, including an appropriate *package.json* setup.

```javascript
server.get('/', async (req, res) => {
  headers(res);

  try
  {
      // renders a template and sends the resulting HTML to the client.
      res.render('index', {}); // here index can either be .pug or .ejs
  }
  catch (err)
  {
      app.error(err);
      res.render('index', { error: err.message });
  }
});
```

#### Passing data to your views

To enable index.html to *access data* retrieved from the *Simplicité backend*, we need to pass this data through app.js. This involves declaring a new `server.get()` route for the relevant data—such as `/products` in this case:

```javascript
server.get('/products', async (req, res) => {
    headers(res);
    try {
        const prdList = await products.search(null, { inlineDocuments: ['demoPrdPicture'] });
        res.json(prdList);  // Return JSON data
    } catch (err) {
        app.error(err);
        res.status(500).json({ error: err.message });
    }
});
```

By using *HTML* files for view rendering, data can be passed directly through the `res.json()` function. To correctly parse the previously fetched Business Object data, the `BusinessObject.search()` method can be applied.

#### Fething data from views

Now, to fetch and display the data passed from *app.js*, a simple script will be added to the *index.html* file, referred to as **index.js**.

```javascript
fetch('/products')
    .then(response => response.json())
    .then(products => {
        const list = document.getElementById('product-list');
        products.forEach(prd => {
            const item = document.createElement('li');
            const imageSrc = `data:${prd.demoPrdPicture.mime};base64,${prd.demoPrdPicture.content}`;
            item.innerHTML = `
                ![](img/javascript-dev/imageSrc)
                <h3>${prd.demoPrdName} by ${prd.demoPrdSupId__demoSupName}</h3>
                <p>${prd.demoPrdDescription}</p>
            `;
            list.appendChild(item);
        });
    })
    .catch(err => {
        console.error(`Failed to load products: ${err}`);
    });
```
<details>
<summary>Code Details</summary>

- `fetch('/products')` makes an HTTP GET request to the server at the `/products` endpoint to retrieve a list of products in JSON format.
- `.then(response => response.json())` processes the response by parsing it as JSON, making the product data available for further use.
- `products.forEach(prd => { ... })` iterates over each product in the JSON response to dynamically create an HTML list item (`<li>`) for each product.
- `const imageSrc = ...` constructs a data URL for displaying the product image, which is encoded in base64 format.
- `item.innerHTML = ...` builds the HTML content for each product, including an image, name, supplier, and description.
- `list.appendChild(item)` adds the dynamically created list item to the HTML list (`#product-list`) displayed on the page.
</details>

> ***Note:*** The content and styles are customizable to match your specific needs and design preferences. For simplicity, this example focuses on basic functionality rather than aesthetics.

## Other examples

The Simplicité JavaScript API repositories provide a wealth of examples and demos to help you explore both basic and advanced usage of the library. Whether you are working server-side, client-side, or even within Simplicité itself, these resources offer practical guidance to get started and experiment with custom implementations. Below is an overview of the key repositories and what they offer:

* **Basic Usage:** for foundational examples, check the `test/test*js` files in the [main repository](https://github.com/simplicitesoftware/javascript-api). These files demonstrate *basic API usage*, making them a great starting point to learn how the library works and begin experimenting.

* **Server-Side Demo:** this [repository](https://github.com/simplicitesoftware/nodejs-demo) illustrates how to build a *simple web frontend* connected to a Simplicité backend instance. It’s perfect for understanding how to integrate Simplicité into server-side JavaScript environments.

* **Client-Side Demos:** a variety of examples for *front-end* development using Simplicité. These demos illustrates how the JavaScript API can be implemented across different frameworks. Whether you prefer *plain HTML/JavaScript* or *web frameworks* (React, Angular, ...), these repositories serve as a practical guide for integrating Simplicité into your *client-side projects*. Below is an overview of each demo and what it offers:
  - **Plain web:** this [demo](https://github.com/simplicitesoftware/web-demo) showcases how to integrate Simplicité using just *HTML*, *CSS*, and *vanilla JavaScript*, providing a straightforward and lightweight approach to front-end development.
  - **Vue.js:** this other [demo](https://github.com/simplicitesoftware/vue-demo) demonstrates how to build a dynamic application from a *Vue.js front*, connected to Simplicité's backend.
  - **React:** this [demo](https://github.com/simplicitesoftware/react-demo) highlights the flexibility of React for building *reusable components* and single-page applications powered by Simplicité.
  - **Angular:** this [demo](https://github.com/simplicitesoftware/angular-demo) shows how to implement Simplicité within the structured and modular framework of Angular.

* **Native:** a [React Native demo](https://github.com/simplicitesoftware/react-native-demo) is available for building native mobile applications. Itshowcases how to integrate Simplicité into a *native app*, in that case leveragging the React Native ecosystem.

* **Within Simplicité:**  The [Demo Module repository](https://github.com/simplicitesoftware/module-demo-jslib) demonstrates how to use the JavaScript API *within the Simplicité UI* itself. This is ideal for exploring API usage directly in the context of Simplicité’s integrated environment. It is a good example to more common *javascript development* experiences.

# Core Javascript usages

**JavaScript development** in Simplicité plays a critical role in extending and customizing front-end functionalities. While Simplicité's core architecture is mainly *Java-based*, JavaScript is most frequently encountered in specific contexts, particularly in *External Objects* and *front-end development* scenarios. These use cases arise when there is a need to create specific, client-side behaviors or *integrate external components* into the Simplicité platform.

The *recurring use* of JavaScript in these contexts stems from its ability to:
  - Enhance user interaction with *responsive* front-end elements.
  - Provide flexibility in implementing custom *business logic* at the client level.
  - Seamlessly integrate *external libraries* or *APIs* that complement Simplicité’s core functionalities.

By focusing on these key contexts, JavaScript development within Simplicité complements its Java-based backend, enabling a richer, more adaptable, and interactive front-end experience. Whether building custom components, enhancing default UI behaviors, or connecting external systems, JavaScript is an indispensable tool for unlocking the full potential of the Simplicité platform.

> ***Warning:*** While JavaScript is powerful and flexible, it's essential to avoid overusing it when Simplicité's *built-in features* can achieve the desired outcomes. Relying on custom JavaScript unnecessarily can increase complexity, hinder maintainability, and *disrupt platform updates*. Before diving into custom code, fully explore Simplicité’s native capabilities, such as *Business Logic* configurations, *Declarative Rules* and *Object Hooks*, to ensure your application remains efficient, aligned with the platform, and easier to manage.

## External Objects (within Simplicité)

The main utility for javascript development within Simplicité is the implementation of custom behaviors for your **External Objects** that you want to embed within Simplicité (so of type `com.simplicite.webapp.web.widgets.ResponsiveExternalObject`), this is shown in the [UI Component](/docs/front/ui-component) lesson.

The javascript development will happen within the *SCRIPT* resource of your *External Object*, and will allow you to do two things:

1) **Customized behaviors:** first, you are gonna be able to apply custom behaviors and interactions for your custom object
2) **Communicate with Simplicité:** then, you will be able to make your widget even more interactive by allowing it to discuss in various ways

In this case, you can declare all your javascript code within the *SCRIPT* resource, make sure that you respect common rules and methodologies, so define your methods thoughfully, don't make redundant code, don't hesitate to document your code and make reusable functions in case you need it.

**Example Code:** Displaying a list of the DemoProducts objects, with only the name and price.

* HTML content of the custom widget:
```html
<!-- Starting with an empty object that we'll fill using Javascript -->
<div id="mycustomwidget">
  <div id="mycustomwidget-productlist"></div>
</div>
```

* JavaScript instantiation script of the custom widget:
```javascript
/* Basic javascript simply fetching and displaying the DemoProduct Business Objects */
let app = $ui.getApp();
let prdList = app.getBusinessObject("DemoProduct");
products.search(function(){
  for (let i=0; i<products.list.Length; i++)
  {
    const prd = products.list[i];
    document.getElementById("mycustomwidget-productlist").insertAdjacentHTML(
      'beforeend',
      `<div class="mycustomwidget-product>
        <span class="mycustomwidget-product-name">${prd.demoPrdName}</span>
        <span class="mycustomwidget-product-name">${prd.demoPrdUnitPrice}</span>
      </div>`
    );
  }
}, null, {});
```

* CSS stylesheet of the custom widget:
<details>
<summary>CSS stylesheet code</summary>

```css
/* Simple yet good looking Styles for our objects */
#mycustomwidget {
  width: 100%
}
.mycustomwidget-product {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  background-color:rgb(228, 228, 228);
  color: rgb(36, 36, 36);
  border: solid 0.125rem rgb(36, 36, 36);
  border-radius: 0.5rem;
  transition: all 0.25s ease;
}
.mycustomwidget-product:hover {
  border-radius: 1rem;
  transform: scale(1.05);
}
.mycustomwidget-product-name {
  font-size: 1.25rem;
}
.mycustomwidget-product-price {
  font-size: 1rem;
}
```
</details>

## External Objects (external pages)

Another slightly different case of javascript development within Simplicité can be the implementation of **External Object** being used as *external pages* (so of type `com.simplicite.webapp.web.WebPageExternalObject`), further explored in the [External Pages](/docs/front/web-page) documentation.

> This part of the lesson vows only to present an overview of javascript development setup for such usage of External Objects.

Indeed, the development of a whole web-page isn't exactly the same as the development of an embedded widget. First of all you'll have your javascript acting solely as *client-side* script, with a dedicated *server-side* script in Java.

The base of the script remains quite the same as for the other External Objects:
```javascript
var MyExternalPage = (function($) {
    let app;

    function render(params) {
        app = new Simplicite.Ajax("", "uipublic");
    }
})(jQuery);
```

### Java Code (server-side)

```java
package com.simplicite.extobjects.Training;

import org.json.JSONObject;

import com.simplicite.util.AppLog;
import com.simplicite.util.ExternalObject;
import com.simplicite.util.Tool;
import com.simplicite.util.tools.HTMLTool;
import com.simplicite.util.tools.Parameters;
import com.simplicite.webapp.web.BootstrapWebPage;

public class MyExternalObject extends ExternalObject {
	private static final long serialVersionUID = 1L;

	@Override
	public Object display(Parameters params) {
		try {
			setDecoration(false);

			// Bootstrap page
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

***Code Overview:***
- `ExternalObject` is the class each of your page shall extend in order to be properly instantiated.
- `display(Parameters params)` method is the one you have to override in order to ensure your object is well rendered.
- `BootstrapWebPage` is the object we will use in order to create an external "standalone" webpage, it contains all the necessary functions to instantiate our webpage from Simplicité's resources.
- `wp.setReady(this.getName() + ".render({});");` this is the line responsible for the actual rendering of our pobject; it calls the `setReady` method sets up the `render()` javascript function to be executed when web page is fully loaded.

### Javascript Code (client-side)

```javascript
var MyExternalObject = (function($) {
    let app;

    function render(params) {
        app = new Simplicite.Ajax("", "uipublic");
    }

    return {
        render: render
    };
})(jQuery);
```

***Code Overview:***
- `var MyExternalPage = ...`, here the code is encapsulated within a local variable in order to avoid polluting the global namespace.
- `(function($) {...})(jQuery)` defines an immediately-invoked function expression receiving `jQuery` as an argument.
- `new Simplicite.Ajax()` declares a new instance for the Simplicité session, with parameters `approot = ""` and `gateway = "uipublic"`. To make sure you are applying the right parameters, refer to [this part](https://platform.simplicite.io/current/jsdoc/Simplicite.Ajax.html) of the documentation.
- `function render(params) {...}` is the method called in the **Java code** to be executed when DOM is fully loaded (by `setReady()` method).

To keep on going with your javascript development with this setup, you just have to declare your functions in the encapsulated function, and make sure to call the functions using the correct namespace in your `.html` resource file. In our case if you declare a *sayHello* function in yoir javascript code, then you must call `MyExternalPage.sayHello` inside of your html file.