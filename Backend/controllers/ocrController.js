import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractReceiptData } from '../services/ocrService.js';

// Setup ES module filename/dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload a receipt image, scan via OCR, and return data + image URL
// @route   POST /api/expenses/extract-receipt
// @access  Private
export const extractReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No receipt image uploaded' });
    }

    const imagePath = req.file.path;
    
    // Convert local filename to a URL string that frontend can use
    const host = req.protocol + '://' + req.get('host');
    const receiptUrl = `${host}/uploads/${req.file.filename}`;

    // Extract text using Tesseract
    const extractedData = await extractReceiptData(imagePath);

    // Return the image URL so the user can submit the form with it later
    res.status(200).json({
      amount: extractedData.amount,
      description: extractedData.description,
      receiptUrl: receiptUrl
    });

  } catch (error) {
    console.error('OCR Extraction Failed:', error);
    res.status(500).json({ message: 'Error scanning receipt. Please enter details manually.' });
  }
};
