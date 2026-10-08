import type { QuoteItem } from './types';

declare global {
  interface Element {
    dataset: DOMStringMap;
    value: string;
    files: FileList | null;
    id: string;
    closest<E extends Element = HTMLElement>(selectors: string): E | null;
    matches(selectors: string): boolean;
  }

  interface EventTarget {
    id: string;
    value: string;
    checked: boolean;
    files: FileList | null;
    selectionStart: number | null;
    dataset: DOMStringMap;
    closest<E extends Element = HTMLElement>(selectors: string): E | null;
    matches(selectors: string): boolean;
  }

  interface HTMLElement {
    value: string;
    checked: boolean;
    files: FileList | null;
    selectionStart: number | null;
    setSelectionRange(start: number, end: number): void;
  }

  interface Window {
    _quoteCart?: () => QuoteItem[];
    pdfjsLib?: any;
  }

  var BarcodeDetector: any;
}

export {};
