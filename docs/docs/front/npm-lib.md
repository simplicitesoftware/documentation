---
sidebar_position: 30
title: NPM Library
---

NPM Library
===========

Introduction
------------

The [Simplicité NPM library](https://www.npmjs.com/package/simplicite) is the official JavaScript client
for connecting to a Simplicité backend from outside the platform — standalone web applications,
server-side Node.js projects, or any framework-based frontend.

It exposes the same core API as the in-platform Ajax library and works in both browser and Node.js environments.

Installation
------------

```shell
npm install simplicite
```

Basic usage
-----------

```javascript
import simplicite from 'simplicite';

const app = simplicite.session({ url: '<instance URL>' });

try {
  await app.login({ username: '<username>', password: '<password>' });

  const obj = app.getBusinessObject('MyObject');
  const list = await obj.search();
  // Work with results
} catch (err) {
  console.error(err.message);
}
```

Key features
------------

- **Authentication**: session management, login/logout
- **Business Object CRUD**: search, get, create, update, delete
- **Document handling**: inline documents and thumbnails
- **Metadata access**: field definitions, list of values, object metadata

Demo repositories
-----------------

Official examples for common environments:

| Environment | Repository |
| ----------- | ---------- |
| Node.js | [nodejs-demo](https://github.com/simplicitesoftware/nodejs-demo) |
| Plain HTML/JS | [web-demo](https://github.com/simplicitesoftware/web-demo) |
| Vue.js | [vue-demo](https://github.com/simplicitesoftware/vue-demo) |
| React | [react-demo](https://github.com/simplicitesoftware/react-demo) |
| Angular | [angular-demo](https://github.com/simplicitesoftware/angular-demo) |
| React Native | [react-native-demo](https://github.com/simplicitesoftware/react-native-demo) |
| Within Simplicité | [module-demo-jslib](https://github.com/simplicitesoftware/module-demo-jslib) |

Related
-------

- [NPM JavaScript API reference](https://simplicitesoftware.github.io/javascript-api/)
- [In-platform Development](/docs/front/platform-dev) — for developing inside Simplicité via External Objects
