import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  output,
  Renderer2,
  viewChild,
} from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Annotation as AnnotationModel } from '@core/models';

@Component({
  selector: 'app-annotation',
  imports: [MatIcon, MatMiniFabButton],
  templateUrl: './annotation.html',
  styleUrl: './annotation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Annotation {
  readonly #renderer = inject(Renderer2);
  readonly #el = inject(ElementRef);
  readonly #zone = inject(NgZone);

  readonly annotation = input.required<AnnotationModel>();
  readonly id = input.required<string>();
  readonly delete = output();

  readonly wrapper = viewChild.required<ElementRef<HTMLElement>>('wrapper');
  readonly closeControl = viewChild.required<MatMiniFabButton>('closeControl');

  onDelete() {
    this.delete.emit();
  }

  dragStart() {
    this.#renderer.setStyle(this.#el.nativeElement, 'position', 'fixed');
    this.#renderer.setStyle(this.#el.nativeElement, 'zIndex', 1);
    this.#renderer.setStyle(this.#el.nativeElement, 'pointerEvents', 'none');
  }

  dragEnd() {
    this.#renderer.setStyle(this.#el.nativeElement, 'position', 'static');
    this.#renderer.setStyle(this.#el.nativeElement, 'pointerEvents', 'initial');
  }

  setPosition(x: number, y: number) {
    this.#zone.runOutsideAngular(() => {
      this.#renderer.setStyle(this.#el.nativeElement, 'left', `${x}px`);
      this.#renderer.setStyle(this.#el.nativeElement, 'top', `${y}px`);
    });
  }

  getWrapperSize() {
    const rect = this.wrapper().nativeElement.getBoundingClientRect();

    return {
      height: rect.height,
      width: rect.width,
    };
  }

  getCloseControlSize() {
    const rect = this.closeControl()._elementRef.nativeElement.getBoundingClientRect();

    return {
      height: rect.height,
      width: rect.width,
    };
  }
}
