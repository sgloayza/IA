import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit  {
  dateTimeForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dateTimeForm = this.formBuilder.group({
      datetimeInicio: new FormControl('', [Validators.required]),
      datetimeFin: new FormControl('', [Validators.required]),
      numeroEstacion: new FormControl('', [Validators.required])
    }, { validators: this.dateValidation });
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

