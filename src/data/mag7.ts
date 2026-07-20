// Los "7 magnificos": AAPL, MSFT, GOOGL/GOOG, AMZN, NVDA, META, TSLA.
export const MAG7_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META', 'TSLA']

export function isMag7(ticker: string) {
  return MAG7_TICKERS.includes(ticker)
}
