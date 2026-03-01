import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  AnnotationData,
  AnnotationForm,
  AnnotationResult,
} from '@components/annotation-form/annotation-form';
import { Annotation } from '@components/annotation/annotation';
import { Toolbar } from '@components/toolbar/toolbar';
import { Annotation as AnnotationModel, Document as DocumentObject, Page } from '@core/models';
import { filter } from 'rxjs';

@Component({
  selector: 'app-document',
  imports: [MatProgressSpinner, Toolbar, MatDialogModule, Annotation],
  templateUrl: './document.html',
  styleUrl: './document.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Document {
  readonly #dialog = inject(MatDialog);

  readonly id = input.required<string>();

  readonly document = httpResource<DocumentObject>(() => `/api/documents/${this.id()}`);

  readonly scaleFactor = signal(100);
  readonly scaleStyle = computed(() => `scale(${this.scaleFactor() / 100})`);
  readonly scaleStyleWidth = computed(() => `${this.scaleFactor() + 1}`);

  scale(factorDiff: number): void {
    this.scaleFactor.update((value) => value + factorDiff);
  }

  save(): void {
    const document = this.document.value();

    console.log({ document });
  }

  addAnnotation(e: PointerEvent, page: Page): void {
    const target = e.target;

    if (!target) {
      return;
    }

    const width = (target as HTMLImageElement).width;
    const height = (target as HTMLImageElement).height;

    const positionX = parseFloat(((e.offsetX * 100) / width).toFixed(2));
    const positionY = parseFloat(((e.offsetY * 100) / height).toFixed(2));

    this.#dialog
      .open(AnnotationForm, {
        data: {
          content: '',
        } as AnnotationData,
      })
      .afterClosed()
      .pipe(filter((res) => !!res))
      .subscribe((res: AnnotationResult) => {
        this.document.update((document) => {
          if (!document) {
            return undefined;
          }

          const pages = document.pages.map((p) => {
            if (p.number === page.number) {
              if (!p.annotations) {
                p.annotations = [];
              }

              p.annotations.push({
                id: crypto.randomUUID(),
                content: res,
                positionX,
                positionY,
              });
            }

            return p;
          });

          return {
            ...document,
            pages,
          };
        });
      });
  }

  deleteAnnotation(page: Page, annotation: AnnotationModel): void {
    this.document.update((document) => {
      if (!document) {
        return undefined;
      }

      return {
        ...document,
        pages: document.pages.map((p) => {
          if (p.number === page.number) {
            p.annotations = p.annotations?.filter((a) => a.id !== annotation.id);
          }

          return p;
        }),
      };
    });
  }
}
