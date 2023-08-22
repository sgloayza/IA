import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
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

    /*    
    //PRUEBA GET
    fetch("http://localhost:5000/")
      .then(resultado => resultado.json())
      .then(resultado => {
        console.log("AAAAA",resultado)
    })

    //PRUEBA POST
    const requestData = {
      "station_ids": [
        1,
        2
      ],
      "start_datetime": "2023-05-17 15:00:00",
      "end_datetime": "2023-05-19 13:00:00"
    };
    
    console.log(requestData);
    
    fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: JSON.stringify(requestData), // Convertir a JSON string
      mode: 'no-cors'
    }).then((response) => {
      console.log("BBBB",response);
    }).catch(error => {
      console.log("CCCC",error)
    })
    */
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

  formatDate(dateTime:Date) {
    const date = new Date(dateTime);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  onSubmit() {
    if (this.dateTimeForm.valid) {
      const formData = this.dateTimeForm.value;
      console.log('Datos del formulario:', formData);
      
      const requestData = {
        "station_ids": [
          1,
          2
        ],
        "start_datetime": "2023-05-17 15:00:00", //this.formatDate(formData.datetimeInicio),
        "end_datetime": "2023-05-19 13:00:00" //this.formatDate(formData.datetimeFin)
      };
      
      console.log(requestData," AAAAAAAAAAA");
      
      fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json' // Asegurarse de establecer el encabezado correcto
        },
        mode: 'cors' // Cambiar a modo cors para acceder a la respuesta
      })
      .then(response => response.json())
      .then(dataFromServer => {
        console.log("Respuesta del servidor:", dataFromServer);

        // Transformar los datos en el formato adecuado para la tabla
        const transformedData = [];

        //AMBAS estaciones
        for (const stationId in dataFromServer.stations) {
          for (const date in dataFromServer.stations[stationId]) {
            transformedData.push({
              numeroEstacion: parseInt(stationId, 10),
              fecha: new Date(date),
              numeroEntero: dataFromServer.stations[stationId][date]
            });
          }
        }

        // Asignar los datos a la fuente de datos de la tabla
        this.dataSource.data = transformedData;
      })
      .catch(error => {
        console.log("Error:", error);
      });

    } else {
      console.log('Formulario inválido. Por favor, complete los campos correctamente.');
    }
  }
}
