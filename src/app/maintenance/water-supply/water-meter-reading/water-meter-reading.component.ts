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
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NativeDateAdapter } from '@angular/material/core';
import { debounceTime } from 'rxjs/operators';
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
  selector: 'app-water-meter-reading',
  standalone: true,
  templateUrl: './water-meter-reading.component.html',
  styleUrls: ['./water-meter-reading.component.scss'],
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

export class WaterMeterReadingComponent {
  readingForm: FormGroup;
  meterNumberDisplay: string = 'Keinen Zähler gefunden';

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient) {
    this.readingForm = this.fb.group({
      parcelNumber: [0, [Validators.min(0)]],
      readingValue: [null, [Validators.required, Validators.min(0)]],
      readingDate: [new Date(), Validators.required],
      readingType: [null, Validators.required]
    });

    // 🔁 Parzellennummer-Änderung → aktive Wasseruhr abfragen
    this.readingForm.get('parcelNumber')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(parcelNumber => {
        if (parcelNumber > 0) {
          this.http.get<{ watermeterID: string | null }>(`https://backend.kgv.local:8443/api/water/active-meter?parcelNumber=${parcelNumber}`)
            .subscribe({
              next: (result) => {
                this.meterNumberDisplay = result.watermeterID || 'Kein Zähler';
              },
              error: () => {
                this.meterNumberDisplay = 'Fehler bei Abfrage';
              }
            });
        } else {
          this.meterNumberDisplay = 'Kein Zähler';
        }
      });
  }

  get parcelNumberControl(): FormControl {
    return this.readingForm.get('parcelNumber') as FormControl;
  }

  incrementParcel() {
    const current = this.parcelNumberControl.value || 0;
    this.parcelNumberControl.setValue(current + 1);
  }

  decrementParcel() {
    const current = this.parcelNumberControl.value || 0;
    this.parcelNumberControl.setValue(Math.max(0, current - 1));
  }

  saveReading() {
    if (this.readingForm.valid) {
      const formValue = this.readingForm.value;

      const payload = {
        parcelNumber: formValue.parcelNumber,
        readingValue: formValue.readingValue,
        readingDate: formValue.readingDate,
        readingType: formValue.readingType
      };

      this.http.post('https://backend.kgv.local:8443/api/water/readings', payload)
        .subscribe({
          next: () => {
            this.snackBar.open('Ablesung gespeichert!', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });

            this.readingForm.reset({
              parcelNumber: 0,
              readingDate: new Date(),
              readingType: null
            });
            this.meterNumberDisplay = 'Kein Zähler';
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Fehler beim Speichern der Ablesung', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        });
    } else {
      this.readingForm.markAllAsTouched();
    }
  }

}
