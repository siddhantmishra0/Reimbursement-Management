import axios from 'axios';

const BASE_URL = 'https://api.frankfurter.app';

/**
 * Fetch the exchange rate from `fromCurrency` to `toCurrency`.
 * Uses Frankfurter (European Central Bank data) — free, no API key.
 * Returns { rate, convertedAmount } or throws on failure.
 */
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  // No conversion needed if same currency
  if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
    return { rate: 1, convertedAmount: amount };
  }

  try {
    const response = await axios.get(`${BASE_URL}/latest`, {
      params: { from: fromCurrency.toUpperCase(), to: toCurrency.toUpperCase() },
      timeout: 5000, // 5 second timeout
    });

    const rate = response.data.rates[toCurrency.toUpperCase()];
    if (!rate) {
      throw new Error(`Exchange rate not available for ${fromCurrency} → ${toCurrency}`);
    }

    const convertedAmount = parseFloat((amount * rate).toFixed(2));
    return { rate, convertedAmount };
  } catch (error) {
    // Propagate the error — caller decides whether to use a fallback
    throw new Error(`Currency conversion failed: ${error.message}`);
  }
};
