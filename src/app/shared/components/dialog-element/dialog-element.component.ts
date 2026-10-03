import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'dialog-element',
  templateUrl: './dialog-element.component.html',
  styleUrls: ['./dialog-element.component.scss'],
})
export class DialogElementComponent implements OnInit {
  services: string[] = [
    'Создание сайтов',
    'Продвижение',
    'Реклама',
    'Копирайтинг',
  ];
  selectedService: string = '';

  requestForm = this.fb.group({
    service: ['', [Validators.required]],
    name: [
      '',
      [Validators.required, Validators.pattern(/^(?:([А-ЯЁ][а-яё]*)(\s|$))+$/)],
    ],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^(?:\+|8)[-\s]*[1-9][-\s]*\d(?:[-\s]*\d){0,13}$/)],
    ],
  });
  requestError: boolean = false;
  thanks: boolean = false;
  constructor(
    private dialog: MatDialog,
    private requestService: RequestService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogElementComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {}

  ngOnInit(): void {
    this.selectedService =
      this.data.service !== '' ? this.data.service : this.services[0];
    this.requestForm.patchValue({
      service: this.selectedService,
    });
  }

  request() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched(); 
      return;
    }

    const name = this.requestForm.get('name')?.value;
    const phone = this.requestForm.get('phone')?.value;
    const service = this.requestForm.get('service')?.value;
    if (name && phone && service) {
      this.requestService.requestOrder(name, phone, service).subscribe({
        next: (response) => {
          if(response.error){
            this.requestError=true;
            this.thanks=false;
          } else{
            this.requestError=false;
            this.thanks=true;
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка');
          }
            this.requestError=true;
        },
      });
    }
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
