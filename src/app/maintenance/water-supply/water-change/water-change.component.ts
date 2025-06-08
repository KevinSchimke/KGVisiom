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
import { HttpClient } from '@angular/common/http';

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

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient) {
    this.changeForm = this.fb.group({
      parcelNumber: [0, [Validators.min(0)]],
      changeDate: [new Date(), Validators.required],
      newMeterId: [null, Validators.required],
      newReading: [null, [Validators.required, Validators.min(0)]]
    });

    this.changeForm.get('parcelNumber')?.valueChanges.subscribe(parcelNumber => {
      if (parcelNumber > 0) {
        // Aktive Uhr + letzter Stand + neue freie Uhren
        this.http.get<any>(`https://backend.kgv.local:8443/api/water/switch-info?parcelNumber=${parcelNumber}`)
          .subscribe({
            next: (result) => {
              this.activeMeterNumber = result.activeMeter || 'Kein Zähler';
              this.oldReadingValue = result.oldReading != null ? result.oldReading.toFixed(2) : '—';
              this.availableMeters = result.availableMeters || [];
            },
            error: () => {
              this.activeMeterNumber = 'Fehler';
              this.oldReadingValue = '—';
              this.availableMeters = [];
            }
          });
      } else {
        this.activeMeterNumber = 'Kein Zähler';
        this.oldReadingValue = '—';
        this.availableMeters = [];
      }
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
      const formValue = this.changeForm.value;

      const payload = {
        parcelNumber: formValue.parcelNumber,
        wechselDatum: formValue.changeDate,
        newWatermeterID: formValue.newMeterId,
        readingValueNew: formValue.newReading
      };

      this.http.post('https://backend.kgv.local:8443/api/water/switch', payload)
        .subscribe({
          next: () => {
            this.snackBar.open('Zählerwechsel erfolgreich durchgeführt!', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.changeForm.reset({ changeDate: new Date(), parcelNumber: 0 });
            this.activeMeterNumber = '—';
            this.oldReadingValue = '—';
            this.availableMeters = [];
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Fehler beim Speichern des Zählerwechsels!', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
    } else {
      this.changeForm.markAllAsTouched();
    }
  }

}
