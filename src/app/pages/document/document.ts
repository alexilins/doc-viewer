import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatToolbar } from '@angular/material/toolbar';
import { Document as DocumentObject } from '@core/models';

@Component({
  selector: 'app-document',
  imports: [MatToolbar, MatProgressSpinner, MatIcon, MatMiniFabButton, MatButton],
  templateUrl: './document.html',
  styleUrl: './document.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Document {
  readonly id = input.required<string>();
  readonly document = httpResource<DocumentObject>(() => `/api/documents/${this.id()}`);

  readonly scaleFactor = signal(100);
  readonly scaleStyle = computed(() => `scale(${this.scaleFactor() / 100})`);

  readonly annotations = signal([]);

  scale(factorDiff: number): void {
    this.scaleFactor.update((value) => value + factorDiff);
  }

  save(): void {
    const document = this.document.value();
    const annotations = this.annotations();

    // TODO
    const mergedData = document;

    console.log({
      mergedData,
    });
  }

  addAnnotation(e: PointerEvent): void {
    const target = e.target;

    if (!target) {
      return;
    }

    const width = (target as HTMLImageElement).width;
    const height = (target as HTMLImageElement).height;

    const positionX = parseFloat(((e.offsetX * 100) / width).toFixed(2));
    const positionY = parseFloat(((e.offsetY * 100) / height).toFixed(2));
  }
}
