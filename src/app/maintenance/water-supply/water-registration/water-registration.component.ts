import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';

export class YearOnlyDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    return date ? date.getFullYear().toString() : '';
  }
}

export const YEAR_ONLY_FORMATS = {
  parse: { dateInput: 'yyyy' },
  display: {
    dateInput: 'yyyy',
    monthYearLabel: 'yyyy',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-water-registration',
  standalone: true,
  templateUrl: './water-registration.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
  ],
  providers: [
    { provide: DateAdapter, useClass: YearOnlyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMATS }
  ]
})
export class WaterRegistrationComponent {
  registerForm: FormGroup;
  sizeOptions = ['Unbekannt', '1/2 Zoll', '3/4 Zoll', '1 Zoll', '1 1/4 Zoll'];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      parcelNumber: [0],
      meterNumber: [''],
      calibrationYear: [null],
      size: ['Unbekannt']
    });
  }

  get calibrationYearControl(): FormControl {
    return this.registerForm.get('calibrationYear') as FormControl;
  }

  get parcelNumberControl(): FormControl {
    return this.registerForm.get('parcelNumber') as FormControl;
  }

  incrementParcel() {
    const ctrl = this.parcelNumberControl;
    ctrl.setValue((ctrl.value || 0) + 1);
  }

  decrementParcel() {
    const ctrl = this.parcelNumberControl;
    const current = ctrl.value || 0;
    if (current > 0) {
      ctrl.setValue(current - 1);
    }
  }

  setYear(date: Date, picker: MatDatepicker<Date>) {
    const year = date.getFullYear();
    this.calibrationYearControl.setValue(new Date(year, 0, 1));
    picker.close();
  }

  register() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Backend-Aufruf hier integrieren
    }
  }
}
