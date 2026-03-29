import Tesseract from 'tesseract.js';
import path from 'path';

/**
 * Extracts text from an image using Tesseract OCR and parses it for useful expense data.
 * @param {string} imagePath - The path to the image file to be processed.
 * @returns {Promise<{ amount: number | null, text: string }>}
 */
export const extractReceiptData = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        // logger: m => console.log(m) // Optional: detailed progress
      }
    );

    // Simple parser for amount
    const amount = parseAmount(text);
    const description = parseDescription(text);

    return { amount, description, rawText: text };
  } catch (error) {
    console.error('OCR Processing Error:', error);
    throw new Error('Failed to extract data from receipt');
  }
};

/**
 * Very basic attempt to find the highest dollar amount or "Total: XXX"
 */
const parseAmount = (text) => {
  // Try to find an explicit "Total" amount
  const totalRegex = /total[\s:]+\$?\s*([\d,]+\.\d{2})/i;
  const totalMatch = text.match(totalRegex);
  if (totalMatch) {
    return parseFloat(totalMatch[1].replace(/,/g, ''));
  }

  // Fallback: finding the largest monetary value (often the total)
  const currencyRegex = /\$?\s*([\d,]+\.\d{2})/g;
  let matches = [];
  let match;
  while ((match = currencyRegex.exec(text)) !== null) {
    matches.push(parseFloat(match[1].replace(/,/g, '')));
  }

  if (matches.length > 0) {
    return Math.max(...matches);
  }

  return null;
};

/**
 * Very basic attempt to get a vendor name or description from the first few lines of the receipt.
 */
const parseDescription = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length > 0) {
    // The first line is often the store/vendor name
    return lines[0];
  }
  return '';
};
