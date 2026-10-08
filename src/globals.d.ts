import type { QuoteItem } from './types';

declare global {
  interface Window {
    _quoteCart?: () => QuoteItem[];
    pdfjsLib?: any;
  }

  var BarcodeDetector: any;
}

export {};
