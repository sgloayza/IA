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
  isLoading = false;
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
      const startDatetime = new Date(datetimeInicio);
      const endDatetime = new Date(datetimeFin);            
      startDatetime.setMinutes(0);   // Establece los minutos en 0
      startDatetime.setSeconds(0);   // Establece los segundos en 0

      // Calcular horas laborales trabajadas
      const startHour = 7; // 7 am
      const endHour = 17;  // 5 pm
      const millisecondsInHour = 60 * 60 * 1000; // Milisegundos en una hora      
      const startTime = startDatetime.getTime();
      const endTime = endDatetime.getTime();      
      let workingHours = 0;
      if (endTime > startTime) {
        for (let currentTime = startTime; currentTime < endTime; currentTime += millisecondsInHour) {
          const currentHour = new Date(currentTime).getHours();
          
          if (currentHour >= startHour && currentHour < endHour) {
            workingHours++;
          }
        }
      }
      
      //validar que la fecha de fin sea despues de la fecha de inicio
      if (endDatetime <= startDatetime) {
        console.log("FECHA",endDatetime <= startDatetime)
        return { dateRangeInvalid: true };
      }

      //validar que las horas trabajadas sean menos o igual a 10
      if (workingHours > 10) {
        console.log("HORA",workingHours <= 10,"HORAS TRABAJADAS",workingHours)
        console.log(workingHours,"HORAS TRABAJADAS")
        return { minTimeDifferenceNotMet: true };
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
    const minutes = "00";
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  onSubmit() {
    if (this.dateTimeForm.valid) {
      this.isLoading = true;
      const formData = this.dateTimeForm.value;
      console.log('Datos del formulario:', formData);

      const requestData = {
        "station_ids": [
          1,
          2
        ],
        "start_datetime": this.formatDate(formData.datetimeInicio), //"2023-05-17 15:00:00",
        "end_datetime": this.formatDate(formData.datetimeFin) //"2023-05-19 13:00:00"
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
        this.dataSource.paginator = this.paginator;
      })
      .catch(error => {
        console.log("Error:", error);
      }).finally(() => {
        this.isLoading = false;
      });
    } else {
      this.dataSource = new MatTableDataSource<any>([]); // Inicializar con una matriz vacía
      this.isLoading = false;
      console.log('Formulario inválido. Por favor, complete los campos correctamente.');
    }
  }
}
