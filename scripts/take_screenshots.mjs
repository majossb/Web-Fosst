import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = 'C:\\Users\\Maria Jose\\.gemini\\antigravity\\brain\\da8cccc1-0deb-4daa-bf42-ee9f5bb2573f';

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
    };
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 4329;

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const widths = [390, 768, 1024, 1280, 1440, 1672];

  for (const width of widths) {
    const page = await browser.newPage();
    const height = width < 768 ? 950 : 1000;
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${PORT}/#nosotros`, { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      const el = document.getElementById('nosotros');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        el.classList.add('is-revealed');
      }
    });

    await new Promise(r => setTimeout(r, 1200));

    const section = await page.$('#nosotros');
    const outPath = path.join(outputDir, `stage1_${width}px.png`);
    if (section) {
      await section.screenshot({ path: outPath });
    } else {
      await page.screenshot({ path: outPath });
    }
    console.log(`Captured ${width}px -> ${outPath}`);

    // If 1280px, also capture flipped state of card 2
    if (width === 1280) {
      await page.evaluate(() => {
        const card = document.querySelectorAll('.flip-card')[1];
        if (card) {
          card.dataset.flipped = 'true';
        }
      });
      await new Promise(r => setTimeout(r, 600));
      const flippedPath = path.join(outputDir, `stage1_1280px_flipped.png`);
      const s = await page.$('#nosotros');
      if (s) {
        await s.screenshot({ path: flippedPath });
        console.log(`Captured flipped state -> ${flippedPath}`);
      }
    }

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('All screenshots completed successfully!');
  process.exit(0);
});
