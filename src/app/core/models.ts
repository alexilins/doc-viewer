interface Annotation {
  id: string;
  content: string;
}

interface Page {
  number: number;
  imageUrl: string;
  annotations?: Annotation[];
}

export interface Document {
  name: string;
  pages: Page[];
}
