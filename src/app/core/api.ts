import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { Document } from './models';

@Injectable({
  providedIn: 'root',
})
export class Api {
  documentResource(id: Signal<string>): HttpResourceRef<Document | undefined> {
    return httpResource<Document>(() => `/api/documents/${id()}`);
  }

  save(document: Document): void {
    console.log(document);
  }
}
