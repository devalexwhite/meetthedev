---
layout: post
title: "Up and running in minutes with Tailwind CSS and Alpine.js"
date: 2021-01-01 09:57:55 -0500
category: article
excerpt_separator: <!--more-->
---

Finding the time to work on side projects is tough, and the last thing you want to do is spend that time just getting your project to build. I’ll show you how to leverage Parcel Bundler to get up and running in just a few minutes!

<!--more-->

Parcel Bundler is like web pack, but configuration free. Point it at a HTML or JS file and let it do it’s magic. Seriously, it’s a weekend hacker’s best friend! Tailwind CSS makes styling a breeze with a huge library of utility CSS classes. Alpine.js gives you a lot of the power of a Frontend framework, without the overhead. Combined, these tools give you enough to build just about anything!

Start off in a new, empty folder. We’ll first setup NPM, GIT and install Parcel.

```bash
> npm init -y
> git init
> npm i --save-dev parcel@nightly
```

You’ll notice we are using the nigthly build of Parcel. This is due to Tailwind CSS requiring PostCSS >8.0, which in turn requires the newest builds of Parcel. Another option would be to use the compatibility build of Tailwind CSS.

Next, we’ll get PostCSS and Tailwind CSS setup. PostCSS and a prerequisite of Tailwind, as is autoprefixer.

```bash
> npm i --save-dev autoprefixer tailwindcss postcss
> npx tailwindcss init
```

The last step scallfolds out a configuration file for Tailwind CSS that you can use to [customize various properties](https://tailwindcss.com/docs/configuration).

Next, we need to create a `/.postcssrc` file to configure PostCSS to use autoprefixed and Tailwind CSS. Simply paste the following into the file:

```json
{
  "plugins": {
    "tailwindcss": {},
    "autoprefixer": {}
  }
}
```

This file alone is enough for Parcel to run CSS files through PostCSS and apply the Tailwind and autoprefixer plugins.

Next, create a `/css/tailwind.css` file and paste the following:

```postcss
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

We’ll use this to import Tailwind into our project. To do this, create /app.js and paste this:

```js
import "./css/tailwind.css";
```

Let’s pull it all together in an HTML file. Create `/index.html` and paste this:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Tailwind and Alpine</title>
    <script src="app.js" />
  </head>
  <body>
    <div class="text-5xl text-red-700">
      <span>Hello, world</span>
    </div>
  </body>
</html>
```

Through the script tag, Parcel will automatically find and build our JS file.

Finally, modify your `/package.json` file to provide development and production building scripts:

```json
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  },
```

These scripts tell Parcel to use the `index.html` file as the entry point for our application.

At this point, Tailwind CSS should be setup and ready to go. You can verify by running > npm run start and visiting http://localhost:1234 . You should see the following:

![Blank page with hello world](/assets/img/posts/2021-01-01-up-and-running-with-tailwind/1.png)

Now that Tailwind is setup, we’ll get Alpine.js running. Start off by installing Alpine with:

```bash
> npm i alpinejs
```

Next, modify `/app.js` with the following:

```js
import "./css/tailwind.css";
import "alpinejs";
```

That’s it! We can modify our HTML file to take advantage of Alpine:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Joobu</title>
    <script src="app.js" />
  </head>
  <body>
    <div class="text-5xl text-red-700 py-16 w-64 mx-auto">
      <span>Hello, world</span>
      <div x-data="{ show: false }">
        <button
          class="bg-blue-100 text-black text-2xl rounded shadow rounded px-3"
          @click="show = !show"
        >
          Click me
        </button>
        <div x-show="show" class="my-16">
          <h1>Oh, hello!</h1>
        </div>
      </div>
    </div>
  </body>
</html>
```

If Parcel is still running, you should see the changes already (otherwise, `> npm run start` ). Click the button to show and hide the text!

![Hello world text with a button below and Oh, hello text at the bottom](/assets/img/posts/2021-01-01-up-and-running-with-tailwind/2.png)

Just like that, you have the foundation to quickly create beautiful, interactive side projects! With Parcel, you can add [additional JS files](https://parceljs.org/javascript.html), or even [HTML pages](https://parceljs.org/html.html), and Parcel will find and build them.
