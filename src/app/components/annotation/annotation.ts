import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  readonly annotation = input.required<AnnotationModel>();
  readonly delete = output();

  onDelete(): void {
    this.delete.emit();
  }
}
