export interface Annotation {
  id: string;
  content: string;
  positionX: number;
  positionY: number;
}

export interface Page {
  number: number;
  imageUrl: string;
  annotations?: Annotation[];
}

export interface Document {
  name: string;
  pages: Page[];
}
