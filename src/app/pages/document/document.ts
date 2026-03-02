import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  NgZone,
  signal,
} from '@angular/core';
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
import { throttle } from '@core/throttle';
import { filter } from 'rxjs';

@Component({
  selector: 'app-document',
  imports: [MatProgressSpinner, Toolbar, MatDialogModule, Annotation],
  templateUrl: './document.html',
  styleUrl: './document.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseup)': 'onMouseUp($event)',
  },
})
export class Document {
  readonly #dialog = inject(MatDialog);

  readonly id = input.required<string>();

  readonly document = httpResource<DocumentObject>(() => `/api/documents/${this.id()}`);

  readonly scaleFactor = signal(100);
  readonly scaleStyle = computed(() => `scale(${this.scaleFactor() / 100})`);
  readonly scaleStyleWidth = computed(() => `${this.scaleFactor() + 1}`);

  readonly #draggingEl = signal<null | Annotation>(null);
  readonly #zone = inject(NgZone);

  scale(factorDiff: number) {
    this.scaleFactor.update((value) => value + factorDiff);
  }

  save() {
    const document = this.document.value();

    console.log({ document });
  }

  addAnnotation(e: PointerEvent, page: Page) {
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

  deleteAnnotation(page: Page, annotation: AnnotationModel) {
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

  onMouseDown(e: MouseEvent, annotationEl: Annotation) {
    this.#draggingEl.set(annotationEl);

    annotationEl.dragStart();
    annotationEl.setPosition(e.x, e.y);
  }

  onMouseOver(e: MouseEvent) {
    this.#zone.runOutsideAngular(
      throttle(() => {
        if (!this.#draggingEl()) {
          return;
        }

        this.#draggingEl()?.setPosition(e.x, e.y);
      }, 60),
    );
  }

  onMouseUp(e: MouseEvent) {
    if (!this.#draggingEl()) {
      return;
    }

    const target = e.target;

    if (!target) {
      return;
    }

    const width = (target as HTMLImageElement).width;
    const height = (target as HTMLImageElement).height;

    const annotationSize = this.#draggingEl()!.getWrapperSize();
    const closeControlSize = this.#draggingEl()!.getCloseControlSize();
    const offset = closeControlSize.width;

    let x: number;
    let y: number;

    if (e.offsetX + annotationSize.width + offset < width) {
      x = e.offsetX;
    } else {
      x = width - annotationSize.width - offset;
    }

    if (x < offset) {
      x = offset;
    }

    const positionX = parseFloat(((x * 100) / width).toFixed(2));

    if (e.offsetY + annotationSize.height < height) {
      y = e.offsetY;
    } else {
      y = height - annotationSize.height;
    }

    if (y < offset) {
      y = offset;
    }

    if (y > height - annotationSize.height - offset) {
      y = height - annotationSize.height - offset;
    }

    const positionY = parseFloat(((y * 100) / height).toFixed(2));

    this.#draggingEl()?.dragEnd();

    this.document.update((document) => {
      if (!document) {
        return undefined;
      }

      return {
        ...document,
        pages: document.pages.map((p) => {
          if (!p.annotations) {
            return p;
          }

          return {
            ...p,
            annotations: p.annotations.map((a) => {
              if (a.id !== this.#draggingEl()?.id()) {
                return a;
              }

              return {
                ...a,
                positionX,
                positionY,
              };
            }),
          };
        }),
      };
    });

    this.#draggingEl.set(null);
  }
}
