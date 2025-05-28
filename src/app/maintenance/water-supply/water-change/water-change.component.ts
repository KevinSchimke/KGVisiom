import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  NativeDateAdapter
} from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

export class GermanDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (!date) return '';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY'
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-water-change',
  standalone: true,
  templateUrl: './water-change.component.html',
  styleUrls: ['./water-change.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule
  ],
  providers: [
    { provide: DateAdapter, useClass: GermanDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class WaterChangeComponent {
  changeForm: FormGroup;
  activeMeterNumber = 'WM-2022-099';
  oldReadingValue = '123.45';
  availableMeters = [
    { id: 1, display: 'WM-2023-001' },
    { id: 2, display: 'WM-2023-002' },
    { id: 3, display: 'WM-2023-003' }
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.changeForm = this.fb.group({
      parcelNumber: [0, [Validators.min(0)]],
      changeDate: [new Date(), Validators.required],
      newMeterId: [null, Validators.required],
      newReading: [null, [Validators.required, Validators.min(0)]]
    });
  }

  get parcelNumberControl(): FormControl {
    return this.changeForm.get('parcelNumber') as FormControl;
  }

  incrementParcel() {
    const current = this.parcelNumberControl.value || 0;
    this.parcelNumberControl.setValue(current + 1);
  }

  decrementParcel() {
    const current = this.parcelNumberControl.value || 0;
    this.parcelNumberControl.setValue(Math.max(0, current - 1));
  }

  submitChange() {
    if (this.changeForm.valid) {
      console.log(this.changeForm.value);
      this.snackBar.open('Zählerwechsel gespeichert!', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    } else {
      this.changeForm.markAllAsTouched();
    }
  }
}
