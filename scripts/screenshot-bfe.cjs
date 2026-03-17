const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const filePath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    const el = document.querySelector('.bfe-section');
    if (el) window.scrollTo(0, el.offsetTop - 40);
  });
  await new Promise(r => setTimeout(r, 800));
  // Force fade-up elements visible for screenshot
  await page.evaluate(() => {
    document.querySelectorAll('.bfe-section .fade-up').forEach(el => {
      el.classList.add('is-visible');
    });
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'bfe-section.png', fullPage: false });
  console.log('Saved bfe-section.png');

  await browser.close();
})().catch(console.error);
