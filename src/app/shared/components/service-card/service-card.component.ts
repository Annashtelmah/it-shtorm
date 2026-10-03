import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServiceType } from 'src/types/service.type copy';
import { DialogElementComponent } from '../dialog-element/dialog-element.component';

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnInit {
  @Input() service!: ServiceType;
  serverStatikPath: string = './assets/images/services/';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog() {

    this.dialog.open(DialogElementComponent, {
      data:{
         service: this.service?.title ?? ''  
        } 
    });
  }
}
