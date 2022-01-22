---
layout: post
title: "Generating accessible backgrounds using CSS Houdini"
date: 2022-01-22 09:57:55 -0500
category: article
excerpt_separator: <!--more-->
---

What might a practical usage of CSS Houdini look like? Let's build a Houdini Paint API worklet that sets a background color that contrasts the text color!

<!--more-->

![Screenshot of a black square with words inside](/assets/img/posts/2022-01-22-houdini-contrast/1.png)

## The idea

The [Houdini Painting API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API) allows us to generate an image and use that in our CSS. We can also access properties and variable from CSS (but not every property is supported at this time). Using this, we'll create a CSS worklet that allows us to contrast our text color with a black or white background, according to WCAG AA guidelines.

## Let's go!

We'll start with a new HTML file that has a div with an id of `#target` in it.

```html
<div id="target">Our text</div>
```

Our goal is to set the background color of `#target` to provide sufficient contrast with the text color. To get started, let's add the following style definitions to our document.

```html
...
<style>
  #target {
    background-image: paint(aaContrast);
    color: red;
  }
</style>
```

Ideally we would like to be able to simply read our `color: red` CSS property in our worklet, but unfortunately the Painting API doesn't seem to support reading the `color` property. Instead, we will use a CSS variable to set our text color, and read the variable from the worklet. So now our style code will look like this:

```html
...
<style>
  @property --primary-color {
    syntax: "<color>";
    inherits: false;
    initialvalue: #fafafa;
  }

  #target {
    color: var(--primary-color);
    background-image: paint(aaContrast);
  }
</style>
```

I'm using the new [CSS properties and values API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Properties_and_Values_API) to define the syntax for my `--primary-color` variable.

Next up, we need to include the file that will eventually hold our Painting API worklet. We'll do that with a script tag in the document:

```html
<script>
  CSS.paintWorklet.addModule("./houdini_contrast_background.js");
</script>
```

This line of JavaScript loads up our CSS Painting worklet and makes it available to use in our CSS code.

## To the JavaScript!

Our HTML document is ready to go, so let's dig into our worklet's code. Create a JavaScript file in the same directory called `houdini_contrast_background.js`. Paste the following into the file:

```js
class ContrastPainter {
  static get inputProperties() {
    return ["--primary-color", "font-size"];
  }

  paint(ctx, geom, props) {
    const textColor = props.get("--primary-color");
    const fontSize = props.get("font-size").value;

    const contrastColor = meetsAA("#000000", textColor.toString(), fontSize)
      ? "#000000"
      : "#ffffff";

    ctx.beginPath();
    ctx.rect(0, 0, geom.width, geom.height);
    ctx.fillStyle = contrastColor;
    ctx.fill();
  }
}

registerPaint("aaContrast", ContrastPainter);
```

There's a number of things going on here, so let's bread it down.

First, we create a class called `ContrastPainter`. Lines 2-4 specify what properties or variables we want access to from the CSS. We're telling the browser we need the `--primary-color` variable and the `font-size` property. In the future we could probably swap the `--primary-color` with `color`, but unfortunately that doesn't work at the moment.

The `paint` method that begins on line 6 is the meat of our worklet. This is what the browser will call to get an image and pass it to CSS.

The `ctx` parameter is similiar to a canvas context, but does not have feature parity. `geom` gives us access to the size of the target element. Finally, `props` gives us access to our variables and properties. These properties are returned using the new [CSS Typed Object Model API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Typed_OM_API) format.

Inside the `paint` method, we grab the text color and font size. The font size is important as the WCAG specifies separate contrast ratios for text over 18pt. I should note that our code does not account for units other than `px` at the moment.

We use the text color and font size to check if a black background would meet AA contrast ratio for our current text color. If so, we draw a black rectangle, otherwise we draw a white one.

Finally, the last line registers our worklet with the browser.

With our worklet code complete, we need some helper classes for calculating the contrast ratio. Paste the following code at the top of your JavaScript file:

```js
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function meetsAA(backgroundHex, textHex, fontSize) {
  const backgroundRGB = hexToRgb(backgroundHex);
  const textRGB = hexToRgb(textHex);

  const backgroundL = luminance(
    backgroundRGB.r,
    backgroundRGB.g,
    backgroundRGB.b
  );
  const textL = luminance(textRGB.r, textRGB.g, textRGB.b);

  const ratio =
    textL > backgroundL
      ? (backgroundL + 0.05) / (textL + 0.05)
      : (textL + 0.05) / (backgroundL + 0.05);

  if (fontSize < 18) return ratio < 1 / 4.5;
  else return ratio < 1 / 3;
}
```

Going top to bottom, the `hexToRgb` function does exactly as it says, it converts a hex string to an RGB key/value object. This code came from [Stackoverflow user Tim Down](https://stackoverflow.com/a/5624139).

The `luminance` function calculates a luminance value given an RGB color. Luminance is used to calculate the contrast ratio. The `luminance` function was taken from [Stackoverflow user kirilloid](https://stackoverflow.com/a/9733420).

Finally, in the `meetsAA` function, we bring everything together and calculate the contrast ratio using the [formula provided by the W3](https://www.w3.org/TR/WCAG20-TECHS/G17.html). Accounting for font size ([as per guidelines](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast)), we return `true` if the ratio meets AA, and `false` otherwise.

## End result

With everything in place, our CSS worklet should be ready! The finished example is embedded below (**will only work in up-to-date Chromium based browsers**), use the color input to experiment with text colors.

{% include  experiments/houdini_contrast_background.html %}

## Final code

You can see the final code on Github. [https://gist.github.com/devalexwhite/fce21fa633cdebbaa4fff8620e91a14f](https://gist.github.com/devalexwhite/fce21fa633cdebbaa4fff8620e91a14f)
