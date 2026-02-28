import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Document } from '@core/models';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbar, MatIcon, MatMiniFabButton, MatButton],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  readonly document = input.required<Document>();
  readonly scaleFactor = input.required<number>();

  readonly save = output();
  readonly scale = output<number>();

  onSave(): void {
    this.save.emit();
  }

  onScale(factorDiff: number): void {
    this.scale.emit(factorDiff);
  }
}
