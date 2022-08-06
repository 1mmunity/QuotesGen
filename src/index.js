const uuid = require('uuid')
const canvas = require('canvas')
const fetch = require('node-fetch')
const fs = require('fs')
const quotes = require('../quotes.json')

function fetchRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

const IMAGE_URL = 'https://source.unsplash.com/1080x1080/?scenery'

const [w, h] = [1080, 1080]

const image = canvas.createCanvas(1080, 1080)
const context = image.getContext('2d')

async function main() {
  const buffer = await fetch(IMAGE_URL).then(res => res.buffer())
  const quote = fetchRandomQuote()

  const img = new canvas.Image()
  img.src = buffer

  context.drawImage(img, 0, 0)

  context.fillStyle = '#fff'
  context.shadowColor = 'black'
  context.shadowBlur = 10
  context.shadowOffsetX = 0
  context.shadowOffsetY = 0
  context.font = '20px Inter'
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  context.fillText('Adriel\'s Quote Generator', w/2, 50)
  context.font = 'bold 40px Inter'

  const text = fragmentText(context, quote.text, w - 150).join('\n')
  context.fillText(`"${text}"\n\n- ${quote.author || 'Unknown'}`, w/2, h/2 - text.length -2)

  fs.writeFileSync(`./output/${uuid.v4()}.png`, image.toBuffer('image/png'))
}

function fragmentText(ctx, text, maxWidth) {
  var words = text.split(' '),
      lines = [],
      line = "";
  if (ctx.measureText(text).width < maxWidth) {
      return [text];
  }
  while (words.length > 0) {
      var split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
          var tmp = words[0];
          words[0] = tmp.slice(0, -1);
          if (!split) {
              split = true;
              words.splice(1, 0, tmp.slice(-1));
          } else {
              words[1] = tmp.slice(-1) + words[1];
          }
      }
      if (ctx.measureText(line + words[0]).width < maxWidth) {
          line += words.shift() + " ";
      } else {
          lines.push(line);
          line = "";
      }
      if (words.length === 0) {
          lines.push(line);
      }
  }
  return lines;
}

async function a() {
  for (let i = 0; i < 5; i++) {
    main()
    console.log(`Index: ${i+1}`)
    await (new Promise(resolve => setTimeout(resolve, 5000)))
  }
}

a()
