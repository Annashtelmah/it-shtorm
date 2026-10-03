import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {  MatDialogRef} from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'dialog-consultation',
  templateUrl: './dialog-consultation.component.html',
  styleUrls: ['./dialog-consultation.component.scss'],
})
export class DialogConsultationComponent implements OnInit {

  requestForm = this.fb.group({
  
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
    private requestService: RequestService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogConsultationComponent>,
  ) {}

  ngOnInit(): void {
   
  }

  request() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched(); 
      return;
    }

    const name = this.requestForm.get('name')?.value;
    const phone = this.requestForm.get('phone')?.value;
    
    if (name && phone) {
      this.requestService.requestConsultation(name, phone).subscribe({
        next: (response) => {
          if (response.error) {
            this.requestError = true;
            this.thanks = false;
          } else {
            this.requestError = false;
            this.thanks = true;
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка');
          }
          this.requestError = true;
        },
      });
    }
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
