import { analyzeTextDocument, groupWordsIntoLines } from '../domain/nfe-parser';

export interface NfePdfReader {
  read(file: File): Promise<ReturnType<typeof analyzeTextDocument>>;
}

export function createNfePdfReader(): NfePdfReader {
  return {
    async read(file) {
      const pdfjs = window.pdfjsLib;

      if (!pdfjs) {
        throw new Error(
          'Leitor PDF indisponível. Abra a aplicação com internet para carregar o PDF.js ou use o projeto com dependências locais.',
        );
      }

      try {
        pdfjs.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } catch {
        // Alguns adaptadores PDF.js não expõem GlobalWorkerOptions.
      }

      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data }).promise;
      const pageBlocks: string[] = [];
      let wordCount = 0;

      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();
        const words = [];
        const viewport = page.getViewport({ scale: 1 });

        for (const raw of content.items) {
          const text = String(raw.str ?? '').trim();
          if (!text) continue;

          const x = Number(raw.transform?.[4] ?? 0);
          const y =
            viewport.height -
            Number(raw.transform?.[5] ?? 0) -
            Number(raw.height ?? 0);
          const width = Number(raw.width ?? 0);
          const height = Number(raw.height ?? 0);

          words.push({ text, x, y, width, height, page: pageNo });
          wordCount += 1;
        }

        pageBlocks.push(groupWordsIntoLines(words).join('\n'));
      }

      if (!wordCount) {
        return {
          profile: 'generic',
          profileConfidence: 0,
          pages: pdf.numPages,
          rawText: '',
          metadata: {
            number: undefined,
            key: undefined,
            cnpj: undefined,
            issueDate: undefined,
            total: undefined,
            supplierName: undefined,
          },
          items: [],
          warnings: [
            'O PDF não contém texto selecionável. Ele provavelmente é um PDF escaneado/imagem e precisa de OCR.',
          ],
        };
      }

      const result = analyzeTextDocument(pageBlocks.join('\n'));
      result.pages = pdf.numPages;
      return result;
    },
  };
}

export const nfePdfReader = createNfePdfReader();
