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
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dateTimeForm!: FormGroup;
  displayedColumns: string[] = ['numeroEstacion', 'fecha', 'numeroEntero'];
  dataSource = new MatTableDataSource<any>([]); // Inicializar con una matriz vacía

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.dateTimeForm = this.formBuilder.group({
      datetimeInicio: new FormControl('', [Validators.required]),
      datetimeFin: new FormControl('', [Validators.required]),
      numeroEstacion: new FormControl('', [Validators.required])
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


/*
      // Simulación de datos del endpoint
      const dataFromEndpoint: { stations: StationData } = {
        stations: {
          1: {
            "2021-06-21 07:00:00": 0,
            "2021-06-21 08:00:00": 1,
            "2021-06-21 09:00:00": 3,
          },
          2: {
            "2021-06-21 07:00:00": 0,
            "2021-06-21 08:00:00": 1,
            "2021-06-21 09:00:00": 3,
          },
        }
      };

      // Transformar los datos en un formato compatible con MatTableDataSource
      const transformedData = [];
      for (const station in dataFromEndpoint.stations) {
        for (const date in dataFromEndpoint.stations[station]) {
          transformedData.push({
            numeroEstacion: +station, // Convertir a número
            fecha: date,
            numeroEntero: dataFromEndpoint.stations[+station][date] // Convertir a número
          });
        }
      }

      this.dataSource.data = transformedData;
      */



      /*
      // Llenar la matriz dataSource con los datos del formulario
      const newRow = {
        numeroEstacion: formData.numeroEstacion,
        fecha: formData.datetimeInicio, // O datetimeFin, según corresponda
        numeroEntero: 0 // Inicialmente, puedes establecer este valor en 0
      };

      this.dataSource.data.push(newRow);
      this.dataSource.data = [...this.dataSource.data]; // Actualizar la referencia
      */

      const requestData = {
        station_ids: [formData.numeroEstacion],
        start_datetime: formData.datetimeInicio,
        end_datetime: formData.datetimeFin
      };
  
      this.http.post<any>('https://bike-loans-server-pr-1.onrender.com/predict', requestData)
        .pipe(
          catchError(error => {
            console.error('Error en la solicitud POST:', error);
            return of(null); // Devuelve un observable con valor nulo para que el flujo continúe
          })
        )
        .subscribe(response => {
          if (response) {
            console.log('Respuesta del servidor:', response);
  
            /*
            // Agregar la respuesta a la tabla si es necesario
            // Por ejemplo, asumiendo que el servidor devuelve un número entero:
            const newRow = {
              numeroEstacion: formData.numeroEstacion,
              fecha: formData.datetimeInicio,
              numeroEntero: response.prediction
            };
  
            this.dataSource.data.push(newRow);
            this.dataSource.data = [...this.dataSource.data]; // Actualizar la referencia
            */
          }
        });
    } else {
      console.log('Formulario inválido. Por favor, complete los campos correctamente.');
    }
  }
}

