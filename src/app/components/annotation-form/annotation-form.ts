import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

export interface AnnotationData {
  content: string;
}

export type AnnotationResult = string;

@Component({
  selector: 'app-annotation-form',
  imports: [MatInputModule, MatDialogModule, MatButton, FormField],
  templateUrl: './annotation-form.html',
  styleUrl: './annotation-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationForm {
  readonly #data = inject<AnnotationData>(MAT_DIALOG_DATA);

  readonly form = form(
    signal({
      content: this.#data.content,
    }),
    (schemaPath) => {
      required(schemaPath.content);
    },
  );
}
