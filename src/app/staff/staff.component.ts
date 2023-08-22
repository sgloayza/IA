import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

interface StationData {
  [key: number]: { [key: string]: number };
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dateTimeForm!: FormGroup;
  displayedColumns: string[] = ['numeroEstacion', 'fecha', 'numeroEntero'];
  dataSource = new MatTableDataSource<any>([]); // Inicializar con una matriz vacía

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.dateTimeForm = this.formBuilder.group({
      datetimeInicio: new FormControl('', [Validators.required]),
      datetimeFin: new FormControl('', [Validators.required])
    }, { validators: this.dateValidation });
    
    this.dataSource.paginator = this.paginator;

    //PRUEBA GET
    fetch("https://bike-loans-server-pr-1.onrender.com/")
      .then(resultado => resultado.json())
      .then(resultado => {
        console.log(resultado)
    })
  }

  dateValidation(formGroup: FormGroup) {
    const datetimeInicio = formGroup.get('datetimeInicio')?.value;
    const datetimeFin = formGroup.get('datetimeFin')?.value;

    if (datetimeInicio && datetimeFin) {
      if (datetimeFin <= datetimeInicio) {
        return { dateRangeInvalid: true };
      }
    }

    return null;
  }

  onSubmit() {
    if (this.dateTimeForm.valid) {
      const formData = this.dateTimeForm.value;
      console.log('Datos del formulario:', formData);
    } else {
      console.log('Formulario inválido. Por favor, complete los campos correctamente.');
    }
  }
}
