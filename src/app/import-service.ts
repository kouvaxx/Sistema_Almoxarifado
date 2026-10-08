export type ImportKind = 'json' | 'csv' | 'txt' | 'pdf' | 'unsupported';

export interface ImportHandlers {
  json: (file: File) => Promise<void>;
  csv: (file: File) => Promise<void>;
  txt: (file: File) => Promise<void>;
  pdf: (file: File) => Promise<void>;
  unsupported: (file: File) => void;
}

export function detectImportKind(file: File): ImportKind {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'json') return 'json';
  if (ext === 'csv' || file.type === 'text/csv') return 'csv';
  if (ext === 'txt' || file.type === 'text/plain') return 'txt';
  if (ext === 'pdf' || file.type === 'application/pdf') return 'pdf';
  return 'unsupported';
}

export async function dispatchImport(file: File, handlers: ImportHandlers): Promise<void> {
  const kind = detectImportKind(file);

  switch (kind) {
    case 'json':
      await handlers.json(file);
      return;
    case 'csv':
      await handlers.csv(file);
      return;
    case 'txt':
      await handlers.txt(file);
      return;
    case 'pdf':
      await handlers.pdf(file);
      return;
    case 'unsupported':
      handlers.unsupported(file);
      return;
  }
}
