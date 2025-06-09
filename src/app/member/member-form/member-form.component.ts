import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, startWith, switchMap } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDividerModule,
    MatNativeDateModule
  ],
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberFormComponent implements OnInit {
  memberForm: ReturnType<FormBuilder['group']>;
  mitgliedstypen: any[] = [];
  anreden: any[] = [];
  titel: any[] = [];

  filteredOrte$: Observable<any[]> = of([]);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.memberForm = this.fb.group({
      mitgliedstyp: ['', Validators.required],
      anrede: [''],
      titel: [''],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      geburtsname: [''],
      geburtsort: [''],
      geburtsdatum: [''],
      nationalitaet: [''],
      familienstand: [''],
      beruf: [''],
      plzort: [''],
      strasse: [''],
      hausnummer: [''],
      telefon: [''],
      mobil: [''],
      email: [''],
      bankname: [''],
      iban: [''],
      bic: [''],
      mandatsreferenz: ['']
    });
  }

  ngOnInit() {
    this.loadDropdowns();
    this.setupPlzOrtSearch();
    this.setupStreetSearch();
  }

  loadDropdowns() {
    this.http.get<string[]>('https://backend.kgv.local:8443/api/membertypes').subscribe(data => this.mitgliedstypen = data);
    this.http.get<string[]>('https://backend.kgv.local:8443/api/salutations').subscribe(data => this.anreden = data);
    this.http.get<string[]>('https://backend.kgv.local:8443/api/titles').subscribe(data => this.titel = data);
  }

  setupPlzOrtSearch() {
    this.filteredOrte$ = this.memberForm.get('plzort')!.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        const query = typeof value === 'string' ? value : value?.display ?? '';
        if (!query || query.length < 2) return of([]);
        return this.http.get<any[]>(`https://backend.kgv.local:8443/postal-codes/search?q=${query}`);
      })
    );
  }

  displayOrt(ort: any): string {
    return ort && typeof ort === 'object' && 'display' in ort ? ort.display : '';
  }

  onSubmit() {
    if (this.memberForm.valid) {
      console.log('Formulardaten:', this.memberForm.value);
    } else {
      this.memberForm.markAllAsTouched();
    }
  }

  filteredStreets$: Observable<any[]> = of([]);

  setupStreetSearch() {
    this.filteredStreets$ = this.memberForm.get('strasse')!.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        const city = this.memberForm.get('plzort')!.value;
        const cityId = city?.id;
        const query = typeof value === 'string' ? value : value?.street_name ?? '';
        if (!cityId || !query || query.length < 2) return of([]);
        return this.http.get<any[]>(
          `https://backend.kgv.local:8443/streets?city_id=${cityId}&q=${query}`
        );
      })
    );
  }

  displayStreet(street: any): string {
    return street && typeof street === 'object' && 'street_name' in street ? street.street_name : '';
  }
}
