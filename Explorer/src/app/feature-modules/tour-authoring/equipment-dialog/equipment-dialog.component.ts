import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { TourEquipmentService } from '../tour_equipment.service';
import { Tour } from '../tour/model/tour.model';
import { EquipmentTour } from '../tour/model/equipmentTour.model';
import { EquipmentService } from '../equipment.servise';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from '../tour/model/equipment.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-equipment-dialog',
  templateUrl: './equipment-dialog.component.html',
  styleUrls: ['./equipment-dialog.component.css'],
})
export class EquipmentDialogComponent implements OnInit {
  equipment: Equipment[];
  selectedTour: Tour;
  onDodajOpremu: EventEmitter<any> = new EventEmitter();
  onCloseDialog: EventEmitter<any> = new EventEmitter();

  constructor(
    private equipmentService: EquipmentService,
    private toureqService: TourEquipmentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EquipmentDialogComponent>,
    private http: HttpClient
  ) {
    this.selectedTour = data.selectedTour;
  }

  ngOnInit(): void {
    console.log(this.selectedTour);
    if (this.selectedTour) {
      this.equipmentService
        .getEquipment()
        .subscribe((pagedResults: PagedResults<Equipment>) => {
          this.equipment = pagedResults.results;

          this.equipment.forEach((equipmentItem) => {
            equipmentItem.selected = this.setSelectedStatus(equipmentItem);
          });
        });
    }
  }

  setSelectedStatus(equipmentItem: Equipment): boolean {
    if (this.selectedTour && this.selectedTour.id !== undefined) {
      const tourId = this.selectedTour.id;
      console.log(tourId);
      if (tourId) {
        this.toureqService
          .getEquipmentForTour(tourId)
          .subscribe((tourEquipmentList: EquipmentTour[]) => {
            const selectedEquipmentIds = tourEquipmentList.map(
              (item) => item.equipmentId
            );
            console.log('Tour Equipment List:', tourEquipmentList);

            console.log('Selected Equipment IDs:', selectedEquipmentIds);

            this.equipmentService
              .getEquipment()
              .subscribe((pagedResults: PagedResults<Equipment>) => {
                this.equipment = pagedResults.results;
                this.equipment.forEach((equipment) => {
                  equipment.selected = selectedEquipmentIds.includes(
                    equipment.id
                  );

                  if (equipment.selected === true) {
                    console.log('AAAAAAAAA');
                    equipmentItem.selected === true;
                  }
                });
              });
          });
      }
    }

    return true;
  }

  dodajOpremu() {
    if (this.selectedTour) {
      this.equipment.forEach((item) => {
        if (item.selected && item.id !== undefined) {
          if (this.selectedTour.id) {
            this.toureqService
              .addEquipment(this.selectedTour.id, item.id)
              .subscribe((result) => {
                if (result) {
                  item.selected = true;
                }
              });
          }
        }
      });

      this.equipment.forEach((item) => {
        if (!item.selected && item.id !== undefined) {
          if (this.selectedTour.id) {
            this.toureqService
              .deleteEquipment(this.selectedTour.id, item.id)
              .subscribe((result) => {
                if (result) {
                  item.selected = false;
                }
              });
          }
        }
      });
    }
  }
}
