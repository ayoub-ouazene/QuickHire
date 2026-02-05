const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

// Helper to compile HTML with data
async function compileTemplate(templateName, data) {
  const filePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.hbs`);
  const html = await fs.promises.readFile(filePath, 'utf-8');
  return handlebars.compile(html)(data);
}

async function generateAttestationPDF(data) {
  try {
    const formattedData = {
      ...data,
      startDate: moment(data.startDate).format('MMMM D, YYYY'),
      endDate: moment(data.endDate).format('MMMM D, YYYY'),
      currentDate: moment().format('MMMM D, YYYY'),
    };

    const content = await compileTemplate('attestation', formattedData);

    // ✅ FIXED LAUNCH CONFIGURATION
    const browser = await puppeteer.launch({
      headless: true, // Use 'true' (classic mode) instead of 'new' for better Windows compatibility
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Helps prevents memory crashes
        '--disable-gpu' // Windows sometimes struggles with GPU in headless mode
      ],
      timeout: 60000 // Increase timeout to 60 seconds (default is 30s)
    });
    
    const page = await browser.newPage();

    // Set content and wait for network to be idle (ensures logo loads)
    await page.setContent(content, { 
      waitUntil: ['load', 'networkidle0'],
      timeout: 60000 
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    console.error("❌ PDF Generation Error:", error); // Logs the actual error
    throw error;
  }
}

module.exports = { generateAttestationPDF };