function hexToRgb(hex) {
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

function meetsAA(backgroundHex, textColor, fontSize) {
  const backgroundRGB = hexToRgb(backgroundHex);

  const textRGB = hexToRgb(textColor);
  if (textRGB === null) return;

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
