const express = require('express');
const puppeteer = require('puppeteer');
const htmlToDocx = require('html-to-docx');
const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/export/pdf', async (req, res) => {
  const { html } = req.body;
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const buffer = await page.pdf({ format: 'A4' });
  await browser.close();
  res.setHeader('Content-Type', 'application/pdf');
  res.send(buffer);
});

app.post('/export/docx', async (req, res) => {
  const { html } = req.body;
  const buffer = await htmlToDocx(html);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.send(buffer);
});

app.get('/', (req, res) => res.send("Resume Export API is running."));
app.listen(3000, () => console.log('Server running on port 3000'));
