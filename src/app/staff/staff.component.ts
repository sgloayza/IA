import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  dateTimeForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dateTimeForm = this.formBuilder.group({
      datetimeInicio: new FormControl('', [Validators.required]),
      datetimeFin: new FormControl('', [Validators.required])
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
