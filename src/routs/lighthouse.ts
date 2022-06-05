import * as express from 'express';
import * as puppeteer from 'puppeteer';
import * as lighthouse from 'lighthouse';
const config = require('./config.json');
const router = express.Router();
router.get('/', (req, res) => {
  res.status(200).json({
    message:
      'Thanks for requesting us. please make a post request to us so we can give you lighthouse report.',
  });
});
router.post('/', async (req, res, next) => {
  const { url } = req.body;
  const log = console.log;
  const report = await launchBrowserWithLighthouse(1, url);

  async function launchBrowserWithLighthouse(id, url) {
    log(`${id}: Starting browser for ${url}`);

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

    log(`${id}: Browser started for ${url}`);

    config.lighthouseFlags = config.lighthouseFlags || {};

    config.lighthouseFlags.port = new URL(browser.wsEndpoint()).port;

    log(`${id}: Starting lighthouse for ${url}`);

    const lhr = await lighthouse(url, config.lighthouseFlags);

    log(`${id}: Lighthouse done for ${url}`);

    await browser.close();

    log(`${id}: Browser closed for ${url}`);

    return lhr;
  }
  return res.status(200).json(report);
});

module.exports = router;
