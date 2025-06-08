import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';


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
  styleUrls: ['./water-registration.component.scss'],
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
    MatIconModule,
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

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient) {
    this.registerForm = this.fb.group({
      parcelNumber: [0, [Validators.min(0)]],
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
    const current = this.parcelNumberControl.value || 0;
    this.parcelNumberControl.setValue(current + 1);
  }

  decrementParcel() {
    const current = this.parcelNumberControl.value || 0;
    this.parcelNumberControl.setValue(Math.max(0, current - 1));
  }

  setYear(date: Date, picker: any) {
    const year = date.getFullYear();
    this.calibrationYearControl.setValue(new Date(year, 0, 1));
    picker.close();
  }

register() {
  if (this.registerForm.valid) {
    const formValue = this.registerForm.value;

    const payload = {
      meterNumber: formValue.meterNumber,
      parcelNumber: formValue.parcelNumber || null,
      calibrationYear: formValue.calibrationYear,
      size: formValue.size
    };

    this.http.post('https://backend.kgv.local:8443/api/water/register', payload)
      .subscribe({
        next: () => {
          this.snackBar.open('Wasseruhr erfolgreich registriert!', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.registerForm.reset({ size: 'Unbekannt', parcelNumber: 0 });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Fehler bei der Registrierung', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
  } else {
    this.registerForm.markAllAsTouched();
  }
}
}
