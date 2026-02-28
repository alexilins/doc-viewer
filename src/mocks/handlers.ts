import { http, HttpResponse, passthrough } from 'msw';
import document from './document.json';

export const handlers = [
  http.get('/api/documents/:id', () => HttpResponse.json(document)),
  http.all('*', () => passthrough()),
];
