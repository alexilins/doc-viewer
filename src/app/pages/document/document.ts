import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Document as DocumentObject } from '@core/models';

@Component({
  selector: 'app-document',
  imports: [],
  templateUrl: './document.html',
  styleUrl: './document.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Document {
  readonly id = input.required<string>();
  readonly document = httpResource<DocumentObject>(() => `/api/documents/${this.id()}`);
}
