#!/usr/bin/env tsx
import puppeteer from 'puppeteer';
import fs from 'fs';

async function getTranslate(input: string) {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();

  await page.goto('https://fanyi.baidu.com/');

  const inputSelector =
    '#main-outer > div > div > div.translate-wrap > div.translateio > div.translate-main.clearfix > div.trans-left > div > div.input-wrap > div.textarea-wrap > div.textarea-bg > span';

  const outputSelector =
    '#main-outer > div > div > div.translate-wrap > div.translateio > div.translate-main > div.trans-right > div > div > div.output-bd > p.ordinary-output.target-output';

  await page.waitForSelector(inputSelector);

  const adsClose = await page.$('#app-guide > div > div.app-guide-aside-v3 > span');

  if (adsClose) {
    await adsClose.click();
  }

  await page.click(inputSelector);

  await page.type(inputSelector, input);

  await page.waitForSelector(outputSelector);
  let data = await page.$$eval(outputSelector, dom => {
    return dom.map(i => i.innerText);
  });

  console.log(data);

  fs.writeFile('data.json', JSON.stringify(data, null, '\t'), function (err) {
    if (err) {
      console.log(err);
    }
  });

  await page.close();
  await browser.close();
}

(async () => {
  const arg = process.argv[2];
  getTranslate(arg);
})();
