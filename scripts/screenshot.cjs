const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const filePath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  const scrollPositions = [0.2, 0.45, 0.68, 0.90];
  const names = ['p20', 'p45', 'p68', 'p90'];
  for (let i = 0; i < scrollPositions.length; i++) {
    const pct = scrollPositions[i];
    await page.evaluate((p) => {
      const el = document.getElementById('jornada');
      if (el) window.scrollTo(0, el.offsetTop + el.offsetHeight * p);
    }, pct);
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `journey-${names[i]}.png`, fullPage: false });
    console.log(`Saved journey-${names[i]}.png`);
  }

  await browser.close();
})().catch(console.error);
